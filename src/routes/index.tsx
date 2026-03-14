import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const LandingHybrid = lazy(() => import("@/components/landing/LandingHybrid"));

export const Route = createFileRoute("/")({
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
