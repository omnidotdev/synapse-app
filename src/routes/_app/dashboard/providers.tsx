import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/dashboard/providers")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/settings" });
  },
});
