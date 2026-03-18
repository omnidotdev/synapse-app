import { Outlet, createFileRoute } from "@tanstack/react-router";

import WorkspaceSidebar from "@/components/workspace/WorkspaceSidebar";
import { useWorkspace } from "@/lib/context";

export const Route = createFileRoute(
  "/_app/organizations/$orgSlug/workspaces/$workspaceSlug",
)({
  beforeLoad: async ({ params }) => {
    const workspaceSlug = params.workspaceSlug;

    // TODO(warden): add workspace-level read permission check via Warden
    // once slug-to-ID resolution is available in beforeLoad context.
    // Data-level authZ is enforced by synapse-api's workspaces.plugin
    return { workspaceSlug };
  },
  component: WorkspaceLayout,
});

/**
 * Workspace layout.
 * Wraps all routes under /organizations/$orgSlug/workspaces/$workspaceSlug/
 */
function WorkspaceLayout() {
  const { orgSlug, workspaceSlug } = Route.useParams();
  const { workspaces } = useWorkspace();

  const workspace = workspaces.find((w) => w.slug === workspaceSlug);

  if (!workspace) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="font-bold text-2xl text-destructive">
          Workspace not found
        </h1>
        <p className="mt-2 text-muted-foreground">
          Workspace "{workspaceSlug}" doesn't exist or you don't have access.
        </p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex h-full max-w-7xl gap-6 px-4 py-8">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed top-1/3 right-1/4 size-[400px] rounded-full bg-secondary/3 blur-[100px]" />

      <WorkspaceSidebar orgSlug={orgSlug} workspaceSlug={workspaceSlug} />
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
