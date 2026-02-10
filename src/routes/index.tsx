import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context: { auth } }) => {
    if (auth) throw redirect({ to: "/dashboard" });
  },
  component: HomePage,
});

/**
 * Home page.
 */
function HomePage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <div className="flex items-center gap-2 p-2 text-xl">
        Synapse — Unified AI Router
      </div>
      <p className="text-muted-foreground text-sm">
        Sign in to manage your usage, subscriptions, and API keys
      </p>
    </div>
  );
}
