import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import app from "@/lib/config/app.config";
import { BASE_URL } from "@/lib/config/env.config";
import getBilling from "@/lib/providers/billing";
import { authMiddleware } from "@/server/middleware";
import { requirePermission } from "./authorization";

const checkoutSchema = z.object({
  priceId: z.string().startsWith("price_"),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

const checkoutWithWorkspaceSchema = z
  .object({
    priceId: z.string().startsWith("price_"),
    successUrl: z.string().url(),
    cancelUrl: z.string().url(),
    workspaceId: z.string().uuid().optional(),
    createWorkspace: z
      .object({
        name: z.string().min(1).max(100),
        slug: z.string().min(1).max(100).optional(),
      })
      .optional(),
  })
  .refine((data) => data.workspaceId || data.createWorkspace, {
    message: "Either workspaceId or createWorkspace is required",
  });

const subscriptionSchema = z.object({
  entityType: z.string().min(1),
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
 * Get subscription details for an entity.
 */
export const getSubscription = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data) => subscriptionSchema.parse(data))
  .handler(async ({ data, context }) => {
    if (data.entityType !== "user") {
      await requirePermission(
        context.session.user.id,
        data.entityType,
        data.entityId,
        "viewer",
      );
    }

    return getBilling().getSubscription(
      data.entityType,
      data.entityId,
      requireAccessToken(context.session.accessToken),
    );
  });

/**
 * Create a checkout session for a new subscription.
 * Uses the user's existing personal organization rather than creating a new one.
 * @knipignore
 */
export const getCheckoutUrl = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data) => checkoutSchema.parse(data))
  .handler(async ({ data, context }) => {
    try {
      const accessToken = requireAccessToken(context.session.accessToken);

      const personalOrg = context.organizations.find(
        (org: { type: string }) => org.type === "personal",
      );

      if (!personalOrg) {
        return { error: "No personal workspace found" };
      }

      const result = await getBilling().createCheckoutWithWorkspace({
        appId: app.name.toLowerCase(),
        priceId: data.priceId,
        successUrl: data.successUrl ?? `${BASE_URL}/pricing`,
        cancelUrl: data.cancelUrl ?? `${BASE_URL}/pricing`,
        accessToken,
        workspaceId: personalOrg.id,
      });

      return { url: result.checkoutUrl };
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create checkout session",
      };
    }
  });

/**
 * Get billing portal URL for managing subscription.
 */
export const getBillingPortalUrl = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data) => subscriptionSchema.parse(data))
  .handler(async ({ data, context }) => {
    if (data.entityType !== "user") {
      await requirePermission(
        context.session.user.id,
        data.entityType,
        data.entityId,
        "viewer",
      );
    }

    return getBilling().getBillingPortalUrl(
      data.entityType,
      data.entityId,
      app.name.toLowerCase(),
      `${BASE_URL}/profile`,
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
    if (data.entityType !== "user") {
      await requirePermission(
        context.session.user.id,
        data.entityType,
        data.entityId,
        "admin",
      );
    }

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
    if (data.entityType !== "user") {
      await requirePermission(
        context.session.user.id,
        data.entityType,
        data.entityId,
        "admin",
      );
    }

    return getBilling().renewSubscription(
      data.entityType,
      data.entityId,
      requireAccessToken(context.session.accessToken),
    );
  });

/**
 * Get subscription for an organization.
 */
export const getOrgSubscription = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data) => organizationSchema.parse(data))
  .handler(async ({ data, context }) => {
    await requirePermission(
      context.session.user.id,
      "organization",
      data.organizationId,
      "viewer",
    );

    return getBilling().getSubscription(
      "organization",
      data.organizationId,
      requireAccessToken(context.session.accessToken),
    );
  });

/**
 * Create a checkout session with workspace selection or creation.
 */
export const createCheckoutWithWorkspace = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data) => checkoutWithWorkspaceSchema.parse(data))
  .handler(async ({ data, context }) => {
    return getBilling().createCheckoutWithWorkspace({
      appId: app.name.toLowerCase(),
      priceId: data.priceId,
      successUrl: data.successUrl,
      cancelUrl: data.cancelUrl,
      accessToken: requireAccessToken(context.session.accessToken),
      workspaceId: data.workspaceId,
      createWorkspace: data.createWorkspace,
    });
  });
