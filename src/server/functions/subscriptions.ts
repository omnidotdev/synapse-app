import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import getBilling from "@/lib/providers/billing";
import { authMiddleware } from "@/server/middleware";
import { requireEntityAccess } from "./authorization";

const subscriptionSchema = z.object({
  entityType: z.enum(["user", "organization"]),
  entityId: z.string().min(1),
});

const organizationSchema = z.object({
  organizationId: z.string().min(1),
});

/**
 * Validate access token or throw.
 */
const requireAccessToken = (accessToken: string | undefined): string => {
  if (!accessToken) {
    throw new Error("Access token required");
  }
  return accessToken;
};

/**
 * Get subscription details for an entity. Buying and managing a plan happen on
 * the Omni account hub (see `lib/billing/hubLinks`), not here
 */
export const getSubscription = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data) => subscriptionSchema.parse(data))
  .handler(async ({ data, context }) => {
    await requireEntityAccess(
      context,
      data.entityType,
      data.entityId,
      "member",
    );

    return getBilling().getSubscription(
      data.entityType,
      data.entityId,
      requireAccessToken(context.session.accessToken),
    );
  });

/**
 * Cancel a subscription.
 */
export const cancelSubscription = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data) => subscriptionSchema.parse(data))
  .handler(async ({ data, context }) => {
    await requireEntityAccess(context, data.entityType, data.entityId, "admin");

    return getBilling().cancelSubscription(
      data.entityType,
      data.entityId,
      requireAccessToken(context.session.accessToken),
    );
  });

/**
 * Renew a subscription (remove scheduled cancellation).
 */
export const renewSubscription = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data) => subscriptionSchema.parse(data))
  .handler(async ({ data, context }) => {
    await requireEntityAccess(context, data.entityType, data.entityId, "admin");

    return getBilling().renewSubscription(
      data.entityType,
      data.entityId,
      requireAccessToken(context.session.accessToken),
    );
  });

/**
 * Get subscription for an organization.
 */
export const getOrgSubscription = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data) => organizationSchema.parse(data))
  .handler(async ({ data, context }) => {
    await requireEntityAccess(
      context,
      "organization",
      data.organizationId,
      "member",
    );

    return getBilling().getSubscription(
      "organization",
      data.organizationId,
      requireAccessToken(context.session.accessToken),
    );
  });
