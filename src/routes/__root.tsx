import { useSessionRefresh } from "@omnidotdev/providers/react";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useEffect, useRef } from "react";
import { Toaster } from "sonner";

import {
  CommandPalette,
  DefaultCatchBoundary,
  Footer,
  Header,
  NotFound,
} from "@/components/layout";
import app from "@/lib/config/app.config";
import { isDevEnv } from "@/lib/config/env.config";
import appCss from "@/lib/styles/globals.css?url";
import createMetaTags from "@/lib/util/createMetaTags";
import unregisterServiceWorkers from "@/lib/util/unregisterServiceWorkers";
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
  authDegraded: boolean;
}>()({
  beforeLoad: async ({ context: { queryClient } }) => {
    try {
      // Use ensureQueryData so client-side navigations reuse the cached
      // session instead of re-fetching on every route change. This prevents
      // a race where a transient fetch failure returns auth:null and the
      // _app guard redirects the user away from protected routes.
      const { session, organizations, authDegraded } =
        await queryClient.ensureQueryData({
          queryKey: SESSION_QUERY_KEY,
          queryFn: () => fetchSession(),
          staleTime: SESSION_STALE_TIME,
        });

      return { auth: session, organizations, authDegraded };
    } catch {
      // Gracefully degrade so public pages (landing, pricing) still render
      // when the auth service is unreachable or misconfigured
      return { auth: null, organizations: [], authDegraded: false };
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
      { rel: "canonical", href: app.url },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=DM+Mono:ital,wght@0,300..500;1,300..500&display=swap",
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
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: app.name,
          url: app.url,
          description: app.description,
        }),
      },
    ],
  }),
  loader: () => getThemeServerFn(),
  errorComponent: DefaultCatchBoundary,
  // Render 404s in-shell: a thrown `notFound()` renders here inside RootDocument
  // (globals + layout), not as a bare unstyled page. Pairs with the router's
  // `defaultNotFoundComponent` for unmatched routes.
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  // Keep the OAuth access token fresh while the user is idle
  useSessionRefresh(fetchSession);

  // Drop all cached queries when the authenticated identity changes within the
  // same client, so one user never sees another's cached keys/usage data (query
  // keys like ["apiKeys"] are not user-scoped).
  const { queryClient, auth } = Route.useRouteContext();
  const currentUserId = auth?.user?.id ?? null;
  const prevUserId = useRef(currentUserId);
  useEffect(() => {
    if (prevUserId.current !== null && prevUserId.current !== currentUserId) {
      queryClient.clear();
    }
    prevUserId.current = currentUserId;
  }, [currentUserId, queryClient]);

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

  // Evict any service worker left over from when this app shipped one
  useEffect(() => {
    unregisterServiceWorkers();
  }, []);

  return (
    <html suppressHydrationWarning lang="en" className={theme}>
      <head>
        <HeadContent />
      </head>

      <body>
        <ThemeProvider theme={theme}>
          <CommandPalette />
          <Header />

          <div className="relative flex min-h-dvh w-full flex-col gap-0 pl-[calc(100vw-100%)]">
            <main className="mt-16.5 flex-1">{children}</main>

            <Footer />
          </div>

          <Toaster position="top-center" richColors />
        </ThemeProvider>

        {isDevEnv && (
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
        )}

        <Scripts />
      </body>
    </html>
  );
}

export default RootDocument;
