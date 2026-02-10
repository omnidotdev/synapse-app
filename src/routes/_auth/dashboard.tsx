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
    <div className="mx-auto flex h-full max-w-7xl gap-6 px-4 py-8">
      <DashboardSidebar />
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
