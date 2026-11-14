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
 * The Warden subject for a session: the identity provider (Gatekeeper) user
 * id, which is what Warden keys organization roles by. The Better Auth
 * `user.id` is this app's own local id, which Warden never recognizes, so a
 * check against it always denies
 */
export const wardenSubject = (session: {
  user: { identityProviderId?: string | null };
}): string => {
  const subject = session.user.identityProviderId;

  if (!subject) {
    throw new Error("Forbidden: sign in again to verify your workspace access");
  }

  return subject;
};

/** The slice of the server-function context an entity access check reads */
interface AccessContext {
  session: { user: { identityProviderId?: string | null } };
  organizations: { id: string; type?: string }[];
}

/**
 * Enforce that the caller may act on a billing entity, server-side. Throws if
 * denied.
 *
 * - `user`: only the caller themselves
 * - `organization`: the caller's own personal workspace (from the verified
 *   session claims; it is the workspace-level twin of the user entity), or any
 *   other workspace where Warden grants `permission`
 */
export const requireEntityAccess = async (
  context: AccessContext,
  entityType: "user" | "organization",
  entityId: string,
  permission: WardenRelation<"organization">,
): Promise<void> => {
  const subject = wardenSubject(context.session);

  if (entityType === "user") {
    if (entityId !== subject) {
      throw new Error("Forbidden: not your account");
    }

    return;
  }

  const personalWorkspace = context.organizations.find(
    (org) => org.type === "personal",
  );

  if (personalWorkspace?.id === entityId) return;

  await requirePermission(subject, "organization", entityId, permission);
};

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
export const checkPermission = createServerFn({ method: "POST" })
  .inputValidator((data) => checkSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }): Promise<boolean> => {
    const authz = getAuthz();
    if (!authz) return true;

    return authz.checkPermission(
      wardenSubject(context.session),
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
export const batchCheckPermissions = createServerFn({ method: "POST" })
  .inputValidator((data) => batchCheckSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }): Promise<boolean[]> => {
    const authz = getAuthz();
    if (!authz) return data.checks.map(() => true);

    const userId = wardenSubject(context.session);

    // permission validated against the resource type by checkSchema's refine
    const checks = data.checks.map(
      (check): PermissionCheck =>
        ({
          userId,
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
