import {
  MutationCache,
  QueryCache,
  QueryClient,
  matchQuery,
} from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { toast } from "sonner";

import { DefaultCatchBoundary, NotFound } from "@/components/layout";
import { routeTree } from "@/routeTree.gen";

import type { QueryKey } from "@tanstack/react-query";

const SESSION_EXPIRED_MESSAGE =
  "Session expired. Please sign out and sign in again to reconnect";

/**
 * Handle session expiry by showing a toast and redirecting to sign-out.
 * Debounced to prevent multiple redirects from concurrent failing requests.
 */
let isRedirecting = false;
const handleSessionExpiry = (error: Error) => {
  if (!error.message?.includes("Session expired") || isRedirecting) return;
  if (typeof window === "undefined") return;

  isRedirecting = true;
  toast.error(SESSION_EXPIRED_MESSAGE);

  // Brief delay so the user can read the toast before redirect
  setTimeout(async () => {
    try {
      const { default: signOut } = await import("@/lib/auth/signOut");
      await signOut();
    } catch {
      // Fallback if sign-out fails (session already gone)
      window.location.href = "/";
    }
  }, 1500);
};

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidates?: Array<QueryKey>;
    };
  }
}

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // NB: with SSR, it is recommended to set a default staleTime above 0 to avoid refetching immediately on the client. See: https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr#initial-setup
        staleTime: 60 * 1000,
      },
    },
    queryCache: new QueryCache({
      onError: (error) => handleSessionExpiry(error),
    }),
    mutationCache: new MutationCache({
      onError: (error) => handleSessionExpiry(error),
      onSettled: (_data, _error, _variables, _context, mutation) => {
        queryClient.invalidateQueries({
          predicate: (query) => {
            // if `all` is included in the pattern, invalidate entire cache
            if (
              mutation.meta?.invalidates?.some((queryKey) =>
                queryKey.includes("all"),
              )
            ) {
              return true;
            }

            // invalidate all matching tags at once
            // or nothing if no meta is provided
            return (
              mutation.meta?.invalidates?.some((queryKey) =>
                matchQuery({ queryKey }, query),
              ) ?? false
            );
          },
        });
      },
    }),
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultPreload: "intent",
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
};
