import { WARDEN_RELATIONS } from "@omnidotdev/providers";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import getAuthz from "@/lib/providers/authz";
import { authMiddleware } from "@/server/middleware";

import type {
  PermissionCheck,
  WardenRelation,
  WardenResourceType,
} from "@omnidotdev/providers";

/**
 * Enforce a permission check server-side. Throws if denied.
 * No-ops gracefully if authz is not configured.
 */
export const requirePermission = async <T extends WardenResourceType>(
  userId: string,
  resourceType: T,
  resourceId: string,
  permission: WardenRelation<T>,
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

/** Resource types Warden recognizes, for validating dynamic request input */
const resourceTypeSchema = z.enum(
  Object.keys(WARDEN_RELATIONS) as [
    WardenResourceType,
    ...WardenResourceType[],
  ],
);

/**
 * A single permission check, validated at the request boundary. The refine
 * rejects a `permission` that Warden does not define for the given
 * `resourceType`, before the pairing reaches the PDP.
 */
const checkSchema = z
  .object({
    resourceType: resourceTypeSchema,
    resourceId: z.string().uuid(),
    permission: z.string(),
  })
  .refine(
    (data) =>
      (WARDEN_RELATIONS[data.resourceType] as readonly string[]).includes(
        data.permission,
      ),
    { path: ["permission"], message: "Unknown relation for resource type" },
  );

const batchCheckSchema = z.object({ checks: z.array(checkSchema) });

/**
 * Check if the current user has permission on a resource.
 * Returns true if authz is not configured (graceful degradation).
 * @knipignore
 */
export const checkPermission = createServerFn()
  .inputValidator((data) => checkSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }): Promise<boolean> => {
    const authz = getAuthz();
    if (!authz) return true;

    return authz.checkPermission(
      context.session.user.id,
      data.resourceType,
      data.resourceId,
      // validated against the resource type by checkSchema's refine
      data.permission as WardenRelation,
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

    // permission validated against the resource type by checkSchema's refine
    const checks = data.checks.map(
      (check): PermissionCheck =>
        ({
          userId: context.session.user.id,
          resourceType: check.resourceType,
          resourceId: check.resourceId,
          permission: check.permission,
        }) as PermissionCheck,
    );

    if (!authz.checkPermissionsBatch) {
      const results: boolean[] = [];
      for (const check of checks) {
        results.push(
          await authz.checkPermission(
            check.userId,
            check.resourceType,
            check.resourceId,
            check.permission as WardenRelation,
          ),
        );
      }
      return results;
    }

    const results = await authz.checkPermissionsBatch(checks);
    return results.map((result) => result.allowed);
  });
