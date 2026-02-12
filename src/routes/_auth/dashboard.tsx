import { Outlet, createFileRoute } from "@tanstack/react-router";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import createMetaTags from "@/lib/util/createMetaTags";

export const Route = createFileRoute("/_auth/dashboard")({
  head: () => ({
    meta: createMetaTags({ title: "Dashboard" }),
  }),
  component: DashboardLayout,
});

/**
 * Dashboard layout with sidebar navigation.
 */
function DashboardLayout() {
  return (
    <div className="relative mx-auto flex h-full max-w-7xl gap-6 px-4 py-8">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed top-1/3 right-1/4 size-[400px] rounded-full bg-secondary/3 blur-[100px]" />

      <DashboardSidebar />
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
