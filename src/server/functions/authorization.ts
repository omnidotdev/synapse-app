import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import getAuthz from "@/lib/providers/authz";
import { authMiddleware } from "@/server/middleware";

/**
 * Enforce a permission check server-side. Throws if denied.
 * No-ops gracefully if authz is not configured.
 */
export const requirePermission = async (
  userId: string,
  resourceType: string,
  resourceId: string,
  permission: string,
): Promise<void> => {
  const authz = getAuthz();
  if (!authz) return;

  const allowed = await authz.checkPermission(
    userId,
    resourceType,
    resourceId,
    permission,
  );

  if (!allowed) {
    throw new Error(
      `Forbidden: missing ${permission} on ${resourceType}/${resourceId}`,
    );
  }
};

const checkPermissionSchema = z.object({
  resourceType: z.string(),
  resourceId: z.string().uuid(),
  permission: z.string(),
});

const batchCheckSchema = z.object({
  checks: z.array(
    z.object({
      resourceType: z.string(),
      resourceId: z.string().uuid(),
      permission: z.string(),
    }),
  ),
});

/**
 * Check if the current user has permission on a resource.
 * Returns true if authz is not configured (graceful degradation).
 * @knipignore
 */
export const checkPermission = createServerFn()
  .inputValidator((data) => checkPermissionSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }): Promise<boolean> => {
    const authz = getAuthz();
    if (!authz) return true;

    return authz.checkPermission(
      context.session.user.id,
      data.resourceType,
      data.resourceId,
      data.permission,
    );
  });

/**
 * Batch check permissions for multiple resources.
 * Returns an array of booleans corresponding to each check.
 * All return true if authz is not configured.
 */
export const batchCheckPermissions = createServerFn()
  .inputValidator((data) => batchCheckSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }): Promise<boolean[]> => {
    const authz = getAuthz();
    if (!authz) return data.checks.map(() => true);

    if (!authz.checkPermissionsBatch) {
      const results: boolean[] = [];
      for (const check of data.checks) {
        const allowed = await authz.checkPermission(
          context.session.user.id,
          check.resourceType,
          check.resourceId,
          check.permission,
        );
        results.push(allowed);
      }
      return results;
    }

    const results = await authz.checkPermissionsBatch(
      data.checks.map((check) => ({
        userId: context.session.user.id,
        ...check,
      })),
    );
    return results.map((r) => r.allowed);
  });
