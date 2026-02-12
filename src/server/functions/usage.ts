import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { BILLING_BASE_URL } from "@/lib/config/env.config";
import { authMiddleware } from "@/server/middleware";

const entitySchema = z.object({
  entityType: z.string().min(1),
  entityId: z.string().min(1),
});

interface UsageMeter {
  meterKey: string;
  value: number;
  limit: number | null;
  remaining: number | null;
  resetAt: string | null;
}

interface UsageSummary {
  inputTokens: number;
  outputTokens: number;
  requests: number;
  inputTokensLimit: number | null;
  outputTokensLimit: number | null;
  requestsLimit: number | null;
}

/**
 * Find a meter value by key, defaulting to 0.
 */
const findMeter = (meters: UsageMeter[], key: string) =>
  meters.find((m) => m.meterKey === key);

/**
 * Fetch usage summary with named meter values.
 */
export const getUsageSummary = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data) => entitySchema.parse(data))
  .handler(async ({ data, context }): Promise<UsageSummary> => {
    const accessToken = context.session.accessToken;
    if (!accessToken) throw new Error("Access token required");

    const url = `${BILLING_BASE_URL}/usage/synapse/${data.entityType}/${data.entityId}`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      throw new Error(`Usage API error: ${res.status}`);
    }

    const meters: UsageMeter[] = await res.json();

    const inputTokens = findMeter(meters, "input_tokens");
    const outputTokens = findMeter(meters, "output_tokens");
    const requests = findMeter(meters, "requests");

    return {
      inputTokens: inputTokens?.value ?? 0,
      outputTokens: outputTokens?.value ?? 0,
      requests: requests?.value ?? 0,
      inputTokensLimit: inputTokens?.limit ?? null,
      outputTokensLimit: outputTokens?.limit ?? null,
      requestsLimit: requests?.limit ?? null,
    };
  });

export type { UsageSummary };
