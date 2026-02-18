import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { SYNAPSE_API_URL } from "@/lib/config/env.config";
import { authMiddleware } from "@/server/middleware";

const API_GRAPHQL_URL = `${SYNAPSE_API_URL}/graphql`;

interface ApiKey {
  id: string;
  name: string;
  keyHint: string;
  mode: string;
  createdAt: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
  revokedAt: string | null;
}

interface CreateApiKeyResult {
  rawKey: string;
  apiKeyId: string;
  keyHint: string;
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
 * List active API keys for the current user
 */
export const listApiKeys = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<ApiKey[]> => {
    const accessToken = context.session.accessToken;
    if (!accessToken) throw new Error("Access token required");

    const data = await graphql<{
      currentUser: { apiKeys: { nodes: ApiKey[] } };
    }>(
      accessToken,
      `query {
        currentUser {
          apiKeys(
            condition: { revokedAt: null }
            orderBy: CREATED_AT_DESC
          ) {
            nodes {
              id
              name
              keyHint
              mode
              createdAt
              lastUsedAt
              expiresAt
              revokedAt
            }
          }
        }
      }`,
    );

    return data.currentUser?.apiKeys?.nodes ?? [];
  });

const createKeySchema = z.object({
  name: z.string().min(1).max(100),
  mode: z.enum(["byok", "managed"]),
});

/**
 * Create a new API key
 */
export const createApiKey = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data) => createKeySchema.parse(data))
  .handler(async ({ data, context }): Promise<CreateApiKeyResult> => {
    const accessToken = context.session.accessToken;
    if (!accessToken) throw new Error("Access token required");

    const result = await graphql<{ generateApiKey: CreateApiKeyResult }>(
      accessToken,
      `mutation GenerateApiKey($input: GenerateApiKeyInput!) {
        generateApiKey(input: $input) {
          rawKey
          apiKeyId
          keyHint
        }
      }`,
      { input: { name: data.name, mode: data.mode } },
    );

    return result.generateApiKey;
  });

const revokeKeySchema = z.object({
  id: z.string().uuid(),
});

/**
 * Revoke an API key
 */
export const revokeApiKey = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data) => revokeKeySchema.parse(data))
  .handler(async ({ data, context }): Promise<boolean> => {
    const accessToken = context.session.accessToken;
    if (!accessToken) throw new Error("Access token required");

    const result = await graphql<{ revokeApiKey: boolean }>(
      accessToken,
      `mutation RevokeApiKey($id: UUID!) {
        revokeApiKey(id: $id)
      }`,
      { id: data.id },
    );

    return result.revokeApiKey;
  });

export type { ApiKey, CreateApiKeyResult };
