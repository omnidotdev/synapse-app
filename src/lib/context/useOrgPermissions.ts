import { useQuery } from "@tanstack/react-query";

import { batchCheckPermissions } from "@/server/functions/authorization";

/**
 * Hook to check the current user's Warden permissions on an organization.
 * Returns permission booleans for viewer, editor, and admin roles.
 *
 * Falls back to all-true when Warden is not configured (graceful degradation).
 */
export function useOrgPermissions(organizationId: string | undefined) {
  const { data, isLoading } = useQuery({
    queryKey: ["orgPermissions", organizationId],
    queryFn: () => {
      // Safe cast: queryFn only runs when `enabled` is true (organizationId is defined)
      const orgId = organizationId as string;

      return batchCheckPermissions({
        data: {
          checks: [
            {
              resourceType: "organization",
              resourceId: orgId,
              permission: "viewer",
            },
            {
              resourceType: "organization",
              resourceId: orgId,
              permission: "editor",
            },
            {
              resourceType: "organization",
              resourceId: orgId,
              permission: "admin",
            },
          ],
        },
      });
    },
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    isLoading,
    canView: data?.[0] ?? true,
    canEdit: data?.[1] ?? true,
    canAdmin: data?.[2] ?? true,
  };
}
