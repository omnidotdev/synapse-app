import { useQuery } from "@tanstack/react-query";

import { batchCheckPermissions } from "@/server/functions/authorization";

/**
 * Hook to check the current user's Warden permissions on an organization.
 * Derives view/edit/admin gates from the org `member` and `admin` relations
 * (the only user-assignable org relations are owner/admin/member).
 *
 * When Warden is not configured the server returns all-true (graceful
 * degradation for local dev). On an actual check failure the booleans fall
 * back to false so the UI fails closed rather than exposing admin controls.
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
              permission: "member",
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
    canView: data?.[0] ?? false,
    canEdit: data?.[1] ?? false,
    canAdmin: data?.[1] ?? false,
  };
}
