import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { authMiddleware } from "@/server/middleware";
import { graphql } from "./graphql";

/** A workspace's Synapse spending limit */
export interface SpendingLimit {
  organizationId: string;
  /** Hard monthly cap on request overage in cents, null when unset */
  hardLimitCents: number | null;
  /** Overage owed this period in cents */
  currentSpendCents: number;
  /** Whether requests past the included allowance are paused at the limit */
  suspended: boolean;
}

/** Aether rejects a hard limit below $10 */
export const MIN_HARD_LIMIT_CENTS = 1000;

/** Upper bound accepted by synapse-api ($100,000/month) */
export const MAX_HARD_LIMIT_CENTS = 10_000_000;

const workspaceSchema = z.object({
  organizationId: z.string().uuid(),
});

const updateSchema = z.object({
  organizationId: z.string().uuid(),
  hardLimitCents: z
    .number()
    .int()
    .min(MIN_HARD_LIMIT_CENTS, "The spending limit must be at least $10")
    .max(MAX_HARD_LIMIT_CENTS, "The spending limit must be at most $100,000"),
});

const SPENDING_LIMIT_FIELDS = `
  organizationId
  hardLimitCents
  currentSpendCents
  suspended
`;

/**
 * Get a workspace's spending limit (workspace members; enforced by synapse-api)
 */
export const getSpendingLimit = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data) => workspaceSchema.parse(data))
  .handler(async ({ data, context }): Promise<SpendingLimit | null> => {
    const result = await graphql<{
      observer: { spendingLimit: SpendingLimit | null } | null;
    }>(
      context.session.accessToken,
      `query SpendingLimit($organizationId: UUID!) {
        observer {
          spendingLimit(organizationId: $organizationId) {${SPENDING_LIMIT_FIELDS}}
        }
      }`,
      data,
    );

    return result.observer?.spendingLimit ?? null;
  });

/**
 * Set a workspace's hard spending limit (workspace admins; enforced by
 * synapse-api through Warden)
 */
export const setSpendingLimit = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data) => updateSchema.parse(data))
  .handler(async ({ data, context }): Promise<SpendingLimit> => {
    const result = await graphql<{ setSpendingLimit: SpendingLimit }>(
      context.session.accessToken,
      `mutation SetSpendingLimit($organizationId: UUID!, $hardLimitCents: Int!) {
        setSpendingLimit(
          organizationId: $organizationId
          hardLimitCents: $hardLimitCents
        ) {${SPENDING_LIMIT_FIELDS}}
      }`,
      data,
    );

    return result.setSpendingLimit;
  });
