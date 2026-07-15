import { useQuery } from "@tanstack/react-query";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { useOrganization } from "@/lib/context";
import { getOrganizationBySlug } from "@/server/functions/organizations";

import type { Organization } from "@/lib/context";

export const Route = createFileRoute("/_app/organizations/$orgSlug")({
  beforeLoad: async ({ params }) => {
    return { orgSlug: params.orgSlug };
  },
  component: OrgLayout,
});

/**
 * Organization layout.
 * Wraps all routes under /organizations/$orgSlug/
 *
 * Access control is enforced at two levels:
 * 1. JWT claims: user must be a member of the org (checked below)
 * 2. Warden PDP: synapse-api organization middleware checks permissions
 *    for all API mutations via authz.checkPermission
 */
function OrgLayout() {
  const { orgSlug } = Route.useParams();
  const { organizations, activeOrganization, setActiveOrganization } =
    useOrganization();

  const claimOrg = organizations.find((o) => o.slug === orgSlug);

  // A just-created organization is not yet in the JWT claims (the org list is
  // hydrated from a short-lived cache), so fall back to a live Gatekeeper lookup
  // until claims catch up. Skipped once the org is present in claims.
  const { data: fallbackOrg, isLoading: isResolvingFallback } = useQuery({
    queryKey: ["organization-fallback", orgSlug],
    queryFn: () => getOrganizationBySlug({ data: { slug: orgSlug } }),
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
          Organization not found
        </h1>
        <p className="mt-2 text-muted-foreground">
          You don't have access to organization "{orgSlug}"
        </p>
      </div>
    );
  }

  return <Outlet />;
}
