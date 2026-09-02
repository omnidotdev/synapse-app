import { gatekeeperOrgManageUrl } from "@omnidotdev/providers/react";
import { Button } from "@omnidotdev/thornberry/button";
import { createFileRoute } from "@tanstack/react-router";
import { ExternalLinkIcon } from "lucide-react";

import { AUTH_BASE_URL } from "@/lib/config/env.config";

export const Route = createFileRoute("/_app/@{$workspaceSlug}/~/members")({
  component: WorkspaceMembersPage,
});

/**
 * Workspace members landing page.
 * Membership and roles are an identity concern owned by the Omni account hub, so
 * this product links out to it rather than re-hosting member management
 */
function WorkspaceMembersPage() {
  const { workspaceSlug } = Route.useParams();

  const manageUrl = AUTH_BASE_URL
    ? gatekeeperOrgManageUrl(AUTH_BASE_URL, workspaceSlug)
    : undefined;

  return (
    <div className="container mx-auto flex flex-col items-start gap-6 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-2xl">Members</h1>

        <p className="max-w-2xl text-muted-foreground">
          Team members and roles are managed in your Omni account, so they stay
          consistent across every Omni product you use.
        </p>
      </div>

      {manageUrl && (
        <Button variant="solid" asChild>
          <a href={manageUrl} target="_blank" rel="noopener noreferrer">
            Manage members in Omni
            <ExternalLinkIcon className="ml-2 h-4 w-4" />
          </a>
        </Button>
      )}
    </div>
  );
}
