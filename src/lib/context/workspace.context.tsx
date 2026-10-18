import { createContext, useCallback, useContext, useState } from "react";

import type { ReactNode } from "react";

/**
 * Workspace from IDP JWT claims.
 * A workspace maps 1:1 to an Omni organization (the tenant the user belongs to).
 */
export interface Workspace {
  id: string;
  name: string | null;
  slug: string;
  logo?: string | null;
  /** Discriminator: 'personal' (auto-created, immutable) or 'team' (collaborative) */
  type: "personal" | "team";
  roles: string[];
  teams: { id: string; name: string }[];
}

interface WorkspaceContextValue {
  /** All workspaces the user is a member of */
  workspaces: Workspace[];
  /** Currently active workspace */
  activeWorkspace: Workspace | null;
  /** Set the active workspace by ID */
  setActiveWorkspace: (orgId: string) => void;
  /** User's personal workspace (always exists) */
  personalWorkspace: Workspace | null;
  /** Check if user has a specific role in the active workspace */
  hasRole: (role: string) => boolean;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

interface WorkspaceProviderProps {
  children: ReactNode;
  workspaces: Workspace[];
  initialOrgId?: string;
}

/**
 * Provider for workspace context.
 * Parses organization claims from IDP session.
 */
export function WorkspaceProvider({
  children,
  workspaces,
  initialOrgId,
}: WorkspaceProviderProps) {
  const [activeOrgId, setActiveOrgId] = useState<string | null>(
    initialOrgId ?? workspaces[0]?.id ?? null,
  );

  const activeWorkspace = workspaces.find((o) => o.id === activeOrgId) ?? null;
  const personalWorkspace =
    workspaces.find((o) => o.type === "personal") ?? null;

  const setActiveWorkspace = useCallback((orgId: string) => {
    setActiveOrgId(orgId);
    // Optionally persist to localStorage/cookie
    if (typeof window !== "undefined") {
      localStorage.setItem("activeOrgId", orgId);
    }
  }, []);

  const hasRole = useCallback(
    (role: string) => {
      return activeWorkspace?.roles.includes(role) ?? false;
    },
    [activeWorkspace],
  );

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        activeWorkspace,
        setActiveWorkspace,
        personalWorkspace,
        hasRole,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

/**
 * Hook to access workspace context.
 * Must be used within WorkspaceProvider.
 */
export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}

/**
 * Parse organization claims from IDP ID token.
 * Claims are namespaced under https://manifold.omni.dev/@omni/claims/organizations
 */
/** @knipignore */
export function parseWorkspaceClaims(
  idToken: Record<string, unknown>,
): Workspace[] {
  const claimsKey = "https://manifold.omni.dev/@omni/claims/organizations";
  const claims = idToken[claimsKey];

  if (!Array.isArray(claims)) {
    return [];
  }

  return claims.map((org) => ({
    id: org.id,
    name: org.name ?? null,
    slug: org.slug,
    logo: org.logo ?? null,
    type: org.type ?? "team",
    roles: org.roles ?? [],
    teams: org.teams ?? [],
  }));
}
