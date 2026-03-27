import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useEffect } from "react";
import { Toaster } from "sonner";

import { DefaultCatchBoundary, Footer, Header } from "@/components/layout";
import app from "@/lib/config/app.config";
import appCss from "@/lib/styles/globals.css?url";
import createMetaTags from "@/lib/util/createMetaTags";
import registerServiceWorker from "@/lib/util/registerServiceWorker";
import ThemeProvider from "@/providers/ThemeProvider";
import { fetchSession } from "@/server/functions/auth";
import { getThemeServerFn } from "@/server/functions/theme";

import type { OrganizationClaim } from "@omnidotdev/providers/auth";
import type { QueryClient } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import type { GetAuthSession } from "@/lib/auth/getAuth";

/** Stable query key for session data */
const SESSION_QUERY_KEY = ["session"] as const;

/** Cache session for 2 minutes to avoid refetching on every navigation */
const SESSION_STALE_TIME = 2 * 60 * 1000;

/**
 * Root route.
 */
export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  auth: GetAuthSession | null;
  organizations: OrganizationClaim[];
}>()({
  // @ts-expect-error BA 1.5 widens user index type to `unknown`, incompatible with TanStack `{}`
  beforeLoad: async ({ context: { queryClient } }) => {
    try {
      // Use ensureQueryData so client-side navigations reuse the cached
      // session instead of re-fetching on every route change. This prevents
      // a race where a transient fetch failure returns auth:null and the
      // _app guard redirects the user away from protected routes.
      const { session, organizations } = await queryClient.ensureQueryData({
        queryKey: SESSION_QUERY_KEY,
        queryFn: () => fetchSession(),
        staleTime: SESSION_STALE_TIME,
      });

      return { auth: session, organizations };
    } catch {
      // Gracefully degrade so public pages (landing, pricing) still render
      // when the auth service is unreachable or misconfigured
      return { auth: null, organizations: [] };
    }
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        name: "theme-color",
        content: app.pwa.themeColor,
      },
      {
        name: "apple-mobile-web-app-capable",
        content: "yes",
      },
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "default",
      },
      {
        name: "apple-mobile-web-app-title",
        content: app.name,
      },
      {
        name: "mobile-web-app-capable",
        content: "yes",
      },
      {
        name: "msapplication-TileColor",
        content: app.pwa.themeColor,
      },
      ...createMetaTags(),
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "manifest",
        href: "/manifest.json",
      },
      {
        rel: "apple-touch-icon",
        href: "/img/favicon-192x192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/img/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/img/favicon-16x16.png",
      },
    ],
  }),
  loader: () => getThemeServerFn(),
  errorComponent: DefaultCatchBoundary,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

/**
 * Root document.
 */
function RootDocument({ children }: PropsWithChildren) {
  const theme = Route.useLoaderData();

  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <html suppressHydrationWarning lang="en" className={theme}>
      <head>
        <HeadContent />
      </head>

      <body>
        <ThemeProvider theme={theme}>
          <Header />

          <div className="relative flex min-h-dvh w-full flex-col gap-0 pl-[calc(100vw-100%)]">
            <main className="mt-16.5 flex-1">{children}</main>

            <Footer />
          </div>

          <Toaster position="top-center" richColors />
        </ThemeProvider>

        <TanStackDevtools
          plugins={[
            {
              name: "TanStack Router",
              render: <TanStackRouterDevtoolsPanel />,
              defaultOpen: true,
            },
            {
              name: "TanStack Query",
              render: <ReactQueryDevtoolsPanel />,
            },
          ]}
        />

        <Scripts />
      </body>
    </html>
  );
}

export default RootDocument;
