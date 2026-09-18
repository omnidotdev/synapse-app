import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import getBilling from "@/lib/providers/billing";
import { authMiddleware } from "@/server/middleware";
import { requirePermission } from "./authorization";

import type { EntitlementsResponse } from "@omnidotdev/providers/billing";

const entitySchema = z.object({
  entityType: z.enum(["user", "organization"]),
  entityId: z.string().uuid(),
  productId: z.string().optional(),
});

const checkEntitlementSchema = z.object({
  entityType: z.enum(["user", "organization"]),
  entityId: z.string().uuid(),
  productId: z.string(),
  featureKey: z.string(),
});

/**
 * Get all entitlements for an entity.
 */
export const getEntitlements = createServerFn()
  .inputValidator((data) => entitySchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }): Promise<EntitlementsResponse | null> => {
    if (data.entityType !== "user") {
      await requirePermission(
        context.session.user.id,
        data.entityType,
        data.entityId,
        "member",
      );
    }

    return getBilling().getEntitlements(
      data.entityType,
      data.entityId,
      data.productId,
      context.session.accessToken,
    );
  });

/**
 * Check if an entity has a specific entitlement.
 * Returns the entitlement value if found, null otherwise.
 */
export const checkEntitlement = createServerFn()
  .inputValidator((data) => checkEntitlementSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }): Promise<string | null> => {
    if (data.entityType !== "user") {
      await requirePermission(
        context.session.user.id,
        data.entityType,
        data.entityId,
        "member",
      );
    }

    return getBilling().checkEntitlement(
      data.entityType,
      data.entityId,
      data.productId,
      data.featureKey,
      context.session.accessToken,
    );
  });
