/**
 * The caller's personal workspace id, or `null` when the session carries no
 * workspaces (a degraded session). Synapse subscriptions and API keys belong to
 * a workspace, and the personal workspace is the default home for a user's own
 * plan and keys, so personal pages read billing from it, not the user entity
 */
const getPersonalWorkspaceId = (
  organizations: { id: string; type?: string }[],
): string | null =>
  organizations.find((org) => org.type === "personal")?.id ?? null;

export default getPersonalWorkspaceId;
