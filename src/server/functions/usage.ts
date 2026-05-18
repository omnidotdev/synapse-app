import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  BILLING_BASE_URL,
  BILLING_SERVICE_API_KEY,
} from "@/lib/config/env.config";
import { authMiddleware } from "@/server/middleware";
import { requirePermission } from "./authorization";

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
    // Enforce viewer permission for org/workspace-scoped usage
    if (data.entityType !== "user") {
      await requirePermission(
        context.session.user.id,
        data.entityType,
        data.entityId,
        "viewer",
      );
    }

    if (!BILLING_BASE_URL) {
      return {
        inputTokens: 0,
        outputTokens: 0,
        requests: 0,
        inputTokensLimit: null,
        outputTokensLimit: null,
        requestsLimit: null,
      };
    }

    const url = `${BILLING_BASE_URL}/usage/synapse/${data.entityType}/${data.entityId}`;

    const headers: Record<string, string> = {};
    if (BILLING_SERVICE_API_KEY) {
      headers["x-service-api-key"] = BILLING_SERVICE_API_KEY;
    }

    const res = await fetch(url, { headers });

    if (!res.ok) {
      throw new Error(`Usage API error: ${res.status}`);
    }

    const body = await res.json();
    const meters: UsageMeter[] = body.meters ?? body;

    const inputTokens = findMeter(meters, "input_tokens");
    const outputTokens = findMeter(meters, "output_tokens");
    const requests = findMeter(meters, "requests");

    return {
      inputTokens: Number(inputTokens?.value ?? 0),
      outputTokens: Number(outputTokens?.value ?? 0),
      requests: Number(requests?.value ?? 0),
      inputTokensLimit: inputTokens?.limit ?? null,
      outputTokensLimit: outputTokens?.limit ?? null,
      requestsLimit: requests?.limit ?? null,
    };
  });

export type { UsageSummary };
