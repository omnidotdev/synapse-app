import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { SYNAPSE_API_URL } from "@/lib/config/env.config";
import { authMiddleware } from "@/server/middleware";

const API_GRAPHQL_URL = `${SYNAPSE_API_URL}/graphql`;

type RoutingMode = "managed" | "byok";

interface UserPreferences {
  routingMode: RoutingMode;
  defaultProvider: string | null;
  notifyUsageThreshold: boolean;
  notifyKeyExpiry: boolean;
}

/**
 * Execute a GraphQL query against synapse-api
 */
const graphql = async <T>(
  accessToken: string,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> => {
  const res = await fetch(API_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`GraphQL request failed: ${res.status}`);
  }

  const json = await res.json();

  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }

  return json.data;
};

/**
 * Fetch user preferences
 */
export const getUserPreferences = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<UserPreferences> => {
    const accessToken = context.session.accessToken;
    if (!accessToken) throw new Error("Access token required");

    const data = await graphql<{ myPreferences: UserPreferences }>(
      accessToken,
      `query {
        myPreferences {
          routingMode
          defaultProvider
          notifyUsageThreshold
          notifyKeyExpiry
        }
      }`,
    );

    return data.myPreferences;
  });

const updateSchema = z.object({
  routingMode: z.enum(["managed", "byok"]).optional(),
  defaultProvider: z.string().nullable().optional(),
  notifyUsageThreshold: z.boolean().optional(),
  notifyKeyExpiry: z.boolean().optional(),
});

/**
 * Update user preferences
 */
export const updateUserPreferences = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data) => updateSchema.parse(data))
  .handler(async ({ data, context }): Promise<UserPreferences> => {
    const accessToken = context.session.accessToken;
    if (!accessToken) throw new Error("Access token required");

    const result = await graphql<{
      updateUserPreferences: UserPreferences;
    }>(
      accessToken,
      `mutation UpdateUserPreferences($input: UpdateUserPreferencesInput!) {
        updateUserPreferences(input: $input) {
          routingMode
          defaultProvider
          notifyUsageThreshold
          notifyKeyExpiry
        }
      }`,
      { input: data },
    );

    return result.updateUserPreferences;
  });

export type { RoutingMode, UserPreferences };
