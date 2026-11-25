/** Route path of a workspace's home, where a switch lands by default */
export const WORKSPACE_HOME = "/@{$workspaceSlug}";

/** The workspace handle's own param, the only one a switch can carry over */
const WORKSPACE_PARAM = "$workspaceSlug";

/** Whether a path segment needs a param other than the workspace handle */
const needsOtherParam = (segment: string) =>
  (segment.match(/\$\w*/g) ?? []).some((param) => param !== WORKSPACE_PARAM);

/**
 * Where switching workspace should land, given the matched routes' full paths
 * from root to leaf, so the user stays on the same page in the other
 * workspace. A page that needs any other param (one workflow, one app) names
 * something that belongs to the old workspace, so the switch backs up to the
 * nearest section above it that is a route of its own (the list it sits in),
 * else the workspace home. Off the workspace tree, a switch opens the
 * workspace home
 */
export const workspaceSwitchTarget = (
  fullPaths: readonly string[],
  isRoute: (path: string) => boolean = () => false,
): string => {
  const leaf = fullPaths
    .filter((path) => path.startsWith(WORKSPACE_HOME))
    .at(-1);
  if (!leaf) return WORKSPACE_HOME;

  const segments = leaf.split("/");
  const entityAt = segments.findIndex(needsOtherParam);
  if (entityAt === -1) return leaf;

  for (let end = entityAt; end > 0; end--) {
    const path = segments.slice(0, end).join("/");
    if (path === WORKSPACE_HOME || isRoute(path) || isRoute(`${path}/`))
      return path;
  }

  return WORKSPACE_HOME;
};
