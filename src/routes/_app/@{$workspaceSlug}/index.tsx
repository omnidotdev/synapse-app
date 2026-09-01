import { Link, createFileRoute } from "@tanstack/react-router";

import { useOrganization } from "@/lib/context";

export const Route = createFileRoute("/_app/@{$workspaceSlug}/")({
  component: WorkspaceDashboard,
});

/**
 * Workspace home.
 * An org is 1:1 with a workspace, so the `@handle` IS the workspace. The home
 * links to the workspace's admin, which lives behind the `~` sentinel.
 */
function WorkspaceDashboard() {
  const { workspaceSlug } = Route.useParams();
  const { organizations } = useOrganization();

  const org = organizations.find((o) => o.slug === workspaceSlug);

  if (!org) return null;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-bold text-2xl">{org.slug}</h1>
          {org.type === "personal" && (
            <span className="rounded bg-muted px-2 py-1 text-xs">Personal</span>
          )}
        </div>
        <p className="mt-1 text-muted-foreground">
          Roles: {org.roles.join(", ")}
        </p>
      </div>

      {/* Admin section (behind the ~ sentinel) */}
      <section>
        <h2 className="mb-4 font-semibold text-lg">Manage</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          <Link
            to="/@{$workspaceSlug}/~/keys"
            params={{ workspaceSlug }}
            className="block rounded-lg border p-3 transition-colors hover:bg-muted"
          >
            API Keys
          </Link>
          <Link
            to="/@{$workspaceSlug}/~/usage"
            params={{ workspaceSlug }}
            className="block rounded-lg border p-3 transition-colors hover:bg-muted"
          >
            Usage
          </Link>
          <Link
            to="/@{$workspaceSlug}/~/members"
            params={{ workspaceSlug }}
            className="block rounded-lg border p-3 transition-colors hover:bg-muted"
          >
            Members
          </Link>
          <Link
            to="/@{$workspaceSlug}/~/billing"
            params={{ workspaceSlug }}
            className="block rounded-lg border p-3 transition-colors hover:bg-muted"
          >
            Billing
          </Link>
          <Link
            to="/@{$workspaceSlug}/~/settings"
            params={{ workspaceSlug }}
            className="block rounded-lg border p-3 transition-colors hover:bg-muted"
          >
            Settings
          </Link>
        </div>
      </section>
    </div>
  );
}
