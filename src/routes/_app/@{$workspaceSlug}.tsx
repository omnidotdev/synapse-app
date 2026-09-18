import { useQuery } from "@tanstack/react-query";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import WorkspaceSidebar from "@/components/workspace/WorkspaceSidebar";
import { useOrganization } from "@/lib/context";
import { getOrganizationBySlug } from "@/server/functions/organizations";

import type { Organization } from "@/lib/context";

export const Route = createFileRoute("/_app/@{$workspaceSlug}")({
  beforeLoad: async ({ params }) => {
    return { workspaceSlug: params.workspaceSlug };
  },
  component: WorkspaceLayout,
});

/**
 * Workspace layout.
 * An org is 1:1 with a workspace, so the `@handle` IS the workspace (one level,
 * no nested workspaces). Wraps the workspace home and its admin (behind `~`).
 *
 * Access control is enforced at two levels:
 * 1. JWT claims: user must be a member of the workspace (checked below)
 * 2. Warden PDP: synapse-api organization middleware checks permissions
 *    for all API mutations via authz.checkPermission
 */
function WorkspaceLayout() {
  const { workspaceSlug } = Route.useParams();
  const { organizations, activeOrganization, setActiveOrganization } =
    useOrganization();

  const claimOrg = organizations.find((o) => o.slug === workspaceSlug);

  // A just-created workspace is not yet in the JWT claims (the org list is
  // hydrated from a short-lived cache), so fall back to a live Gatekeeper lookup
  // until claims catch up. Skipped once the workspace is present in claims.
  const { data: fallbackOrg, isLoading: isResolvingFallback } = useQuery({
    queryKey: ["organization-fallback", workspaceSlug],
    queryFn: () => getOrganizationBySlug({ data: { slug: workspaceSlug } }),
    enabled: !claimOrg,
  });

  const org: Organization | undefined =
    claimOrg ??
    (fallbackOrg
      ? {
          id: fallbackOrg.id,
          name: fallbackOrg.name,
          slug: fallbackOrg.slug,
          logo: fallbackOrg.logo,
          type: fallbackOrg.type,
          roles: [],
          teams: [],
        }
      : undefined);

  useEffect(() => {
    if (claimOrg && activeOrganization?.id !== claimOrg.id) {
      setActiveOrganization(claimOrg.id);
    }
  }, [claimOrg, activeOrganization?.id, setActiveOrganization]);

  if (!org && isResolvingFallback) return null;

  if (!org) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="font-bold text-2xl text-destructive">
          Workspace not found
        </h1>
        <p className="mt-2 text-muted-foreground">
          You don't have access to workspace "{workspaceSlug}"
        </p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex h-full max-w-7xl gap-6 px-4 py-8">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed top-1/3 right-1/4 size-[400px] rounded-full bg-secondary/3 blur-[100px]" />

      <WorkspaceSidebar workspaceSlug={workspaceSlug} />
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
