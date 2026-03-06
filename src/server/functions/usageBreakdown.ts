import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { SYNAPSE_API_URL } from "@/lib/config/env.config";
import { authMiddleware } from "@/server/middleware";

const API_GRAPHQL_URL = `${SYNAPSE_API_URL}/graphql`;

interface ModelBreakdown {
  model: string;
  provider: string;
  inputTokens: number;
  outputTokens: number;
  requests: number;
}

interface DailyUsage {
  date: string;
  inputTokens: number;
  outputTokens: number;
  requests: number;
}

interface UsageBreakdown {
  byModel: ModelBreakdown[];
  byDay: DailyUsage[];
}

const dateRangeSchema = z.object({
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  workspaceId: z.string().optional(),
});

/**
 * Fetch usage breakdown with model and daily aggregation
 */
export const getUsageBreakdown = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data) => dateRangeSchema.parse(data))
  .handler(async ({ data, context }): Promise<UsageBreakdown> => {
    const { accessToken } = context.session;

    const res = await fetch(API_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: `query UsageBreakdown($startDate: String!, $endDate: String!, $workspaceId: String) {
          usageBreakdown(startDate: $startDate, endDate: $endDate, workspaceId: $workspaceId) {
            byModel {
              model
              provider
              inputTokens
              outputTokens
              requests
            }
            byDay {
              date
              inputTokens
              outputTokens
              requests
            }
          }
        }`,
        variables: {
          startDate: data.startDate,
          endDate: data.endDate,
          workspaceId: data.workspaceId,
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`GraphQL request failed: ${res.status}`);
    }

    const json = await res.json();

    if (json.errors?.length) {
      throw new Error(json.errors[0].message);
    }

    return json.data.usageBreakdown ?? { byModel: [], byDay: [] };
  });

export type { UsageBreakdown, ModelBreakdown, DailyUsage };
