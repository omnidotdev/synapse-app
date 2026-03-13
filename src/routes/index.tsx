import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

import { signOutLocal } from "@/server/functions/auth";

const LandingHybrid = lazy(() => import("@/components/landing/LandingHybrid"));

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context: { auth } }) => {
    // Clear zombie sessions: OAuth cookie exists but user is not provisioned
    // (identityProviderId missing). Without this, the header shows "Sign Out"
    // but the user can't reach protected routes
    if (auth?.user && !auth.user.identityProviderId) {
      await signOutLocal();
    }
  },
  component: HomePage,
});

/** Landing page */
function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <LandingHybrid />
    </Suspense>
  );
}
