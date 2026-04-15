import { Outlet, createFileRoute } from "@tanstack/react-router";

import { useOrganization } from "@/lib/context";

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
  const { organizations } = useOrganization();

  const org = organizations.find((o) => o.slug === orgSlug);

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
