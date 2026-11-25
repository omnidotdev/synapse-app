import { workspacesUrl } from "@omnidotdev/providers/react";
import { WorkspaceSwitcher as SharedWorkspaceSwitcher } from "@omnidotdev/thornberry/workspace-switcher";
import {
  useMatches,
  useNavigate,
  useParams,
  useRouteContext,
  useRouter,
} from "@tanstack/react-router";
import { LayoutGridIcon } from "lucide-react";

import useHubLoginHint from "@/lib/auth/useHubLoginHint";
import { ACCOUNT_URL } from "@/lib/config/env.config";
import { workspaceSwitchTarget } from "@/lib/workspace/switchTarget";

import type { WorkspaceOption } from "@omnidotdev/thornberry/workspace-switcher";
import type { Workspace } from "@/lib/context";

/** Map a workspace from the session claims onto a switcher entry */
const toWorkspaceOption = (workspace: Workspace): WorkspaceOption => ({
  id: workspace.id,
  name: workspace.name || `@${workspace.slug}`,
  slug: workspace.slug,
  logo: workspace.logo,
  badge: workspace.type === "personal" ? "Personal" : null,
});

/**
 * Workspace switcher at the top of the workspace sidebar, built on the shared
 * Omni switcher. Choosing another workspace navigates to the same section
 * there (keys, usage, billing, members, settings), or its overview from
 * anywhere else. Workspaces are created and managed on the account hub
 */
const WorkspaceSwitcher = () => {
  const navigate = useNavigate();
  const router = useRouter();
  const { workspaceSlug } = useParams({ strict: false });
  const fullPaths = useMatches({
    select: (matches) => matches.map((match) => match.fullPath),
  });
  const { organizations: workspaces = [] } = useRouteContext({
    strict: false,
  }) as { organizations?: Workspace[] };
  const loginHint = useHubLoginHint();

  if (!workspaceSlug || !workspaces.length) return null;

  const current = workspaces.find(
    (workspace) => workspace.slug === workspaceSlug,
  );

  const selectWorkspace = (id: string) => {
    const next = workspaces.find((workspace) => workspace.id === id);
    if (!next || next.id === current?.id) return;

    navigate({
      to: workspaceSwitchTarget(
        fullPaths,
        (path) => !!router.routesByPath?.[path as never],
      ),
      params: { workspaceSlug: next.slug },
    });
  };

  // Empty when the account hub is not configured, which hides the manage link
  const manageUrl = workspacesUrl(ACCOUNT_URL, { loginHint }) || undefined;

  return (
    <SharedWorkspaceSwitcher
      variant="sidebar"
      workspaces={workspaces.map(toWorkspaceOption)}
      currentWorkspaceId={current?.id}
      onSelect={selectWorkspace}
      actions={[
        {
          id: "all-workspaces",
          label: "All workspaces",
          icon: <LayoutGridIcon />,
          onSelect: () => navigate({ to: "/organizations" }),
        },
      ]}
      manageUrl={manageUrl}
    />
  );
};

export default WorkspaceSwitcher;
