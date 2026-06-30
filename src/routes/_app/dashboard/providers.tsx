import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/dashboard/providers")({
  beforeLoad: ({ preload }) => {
    // Guard against preload navigation (defaultPreload "intent" runs this on hover)
    if (!preload) throw redirect({ to: "/dashboard/settings" });
  },
});
