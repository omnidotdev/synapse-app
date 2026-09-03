import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@omnidotdev/thornberry/avatar";
import { Button } from "@omnidotdev/thornberry/button";
import { Link, createFileRoute, useRouteContext } from "@tanstack/react-router";
import { Users } from "lucide-react";

import CreateOrganizationButton from "@/components/organizations/CreateOrganizationButton";
import authClient from "@/lib/auth/authClient";
import { useOrganization } from "@/lib/context";
import { signOutLocal } from "@/server/functions/auth";

export const Route = createFileRoute("/_app/organizations/")({
  component: OrganizationsPage,
});

/**
 * Organizations list page.
 * Shows all organizations the user is a member of.
 */
function OrganizationsPage() {
  const { organizations } = useOrganization();
  // A degraded session (refresh-token grant failed) is authenticated but has no
  // access token, so organizations came back empty. Without a signal it renders
  // identically to a genuinely organization-less user; distinguish it so the
  // user gets a re-login prompt instead of a dead-end empty state.
  const { authDegraded } = useRouteContext({ strict: false }) as {
    authDegraded?: boolean;
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="font-bold text-2xl">Organizations</h1>

        {organizations.length > 0 && <CreateOrganizationButton />}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {organizations.map((org) => (
          <Link
            key={org.id}
            to="/@{$workspaceSlug}"
            params={{ workspaceSlug: org.slug }}
            className="block rounded-lg border p-4 transition-colors hover:bg-muted"
          >
            <div className="flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-2">
                <AvatarRoot size="sm">
                  <AvatarImage src={org.logo ?? undefined} alt={org.slug} />
                  <AvatarFallback>
                    {org.slug.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </AvatarRoot>
                <h2 className="truncate font-semibold">{org.slug}</h2>
              </div>
              {org.type === "personal" && (
                <span className="rounded bg-muted px-2 py-1 text-xs">
                  Personal
                </span>
              )}
            </div>
            <p className="mt-1 text-muted-foreground text-sm">
              {org.roles.join(", ")}
            </p>
            {org.teams.length > 0 && (
              <p className="mt-2 text-muted-foreground text-xs">
                Teams: {org.teams.map((t) => t.name).join(", ")}
              </p>
            )}
          </Link>
        ))}
      </div>

      {organizations.length === 0 &&
        (authDegraded ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Users className="size-6" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Your session expired</h2>
              <p className="mx-auto mt-1 max-w-sm text-muted-foreground text-sm">
                We could not refresh your session, so your organizations could
                not be loaded. Sign in again to restore access.
              </p>
            </div>
            <Button
              onClick={async () => {
                // The better-auth session is still valid (only the OAuth
                // refresh token is dead), so signing in with an active session
                // just bounces back to the callback without re-authorizing.
                // Clear the local session (and auth cache) first so the OAuth
                // redirect actually fires and mints a fresh token family.
                try {
                  await signOutLocal();
                } catch {
                  // Proceed with re-auth even if local sign-out fails.
                }
                await authClient.signIn.social({
                  provider: "omni",
                  callbackURL: "/organizations",
                });
              }}
            >
              Sign in again
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-16 text-center">
            <p className="text-muted-foreground text-sm">
              No organizations yet. Create one to get started.
            </p>
            <CreateOrganizationButton />
          </div>
        ))}
    </div>
  );
}
