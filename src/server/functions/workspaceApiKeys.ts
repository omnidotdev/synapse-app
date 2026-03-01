import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { authMiddleware } from "@/server/middleware";
import { graphql } from "./graphql";

import type { ApiKey, CreateApiKeyResult } from "./apiKeys";

const workspaceIdSchema = z.object({
  workspaceId: z.string().uuid(),
});

/**
 * List active API keys scoped to a workspace
 */
export const listWorkspaceApiKeys = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data) => workspaceIdSchema.parse(data))
  .handler(async ({ data, context }): Promise<ApiKey[]> => {
    const accessToken = context.session.accessToken;
    if (!accessToken) throw new Error("Access token required");

    const result = await graphql<{
      currentUser: { apiKeys: { nodes: ApiKey[] } };
    }>(
      accessToken,
      `query WorkspaceApiKeys($workspaceId: UUID!) {
        currentUser {
          apiKeys(
            condition: { workspaceId: $workspaceId, revokedAt: null }
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
      { workspaceId: data.workspaceId },
    );

    return result.currentUser?.apiKeys?.nodes ?? [];
  });

const createKeySchema = z.object({
  name: z.string().min(1).max(100),
  workspaceId: z.string().uuid(),
});

/**
 * Create a new API key scoped to a workspace
 */
export const createWorkspaceApiKey = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data) => createKeySchema.parse(data))
  .handler(async ({ data, context }): Promise<CreateApiKeyResult> => {
    const accessToken = context.session.accessToken;
    if (!accessToken) throw new Error("Access token required");

    const result = await graphql<{ generateApiKey: CreateApiKeyResult }>(
      accessToken,
      `mutation GenerateWorkspaceApiKey($input: GenerateApiKeyInput!) {
        generateApiKey(input: $input) {
          rawKey
          apiKeyId
          keyHint
        }
      }`,
      {
        input: {
          name: data.name,
          mode: "managed",
          workspaceId: data.workspaceId,
        },
      },
    );

    return result.generateApiKey;
  });

const revokeKeySchema = z.object({
  id: z.string().uuid(),
});

/**
 * Revoke an API key
 */
export const revokeWorkspaceApiKey = createServerFn()
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

/**
 * Count active API keys for a workspace
 */
export const countWorkspaceApiKeys = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data) => workspaceIdSchema.parse(data))
  .handler(async ({ data, context }): Promise<number> => {
    const accessToken = context.session.accessToken;
    if (!accessToken) throw new Error("Access token required");

    const result = await graphql<{
      currentUser: { apiKeys: { totalCount: number } };
    }>(
      accessToken,
      `query WorkspaceApiKeyCount($workspaceId: UUID!) {
        currentUser {
          apiKeys(
            condition: { workspaceId: $workspaceId, revokedAt: null }
          ) {
            totalCount
          }
        }
      }`,
      { workspaceId: data.workspaceId },
    );

    return result.currentUser?.apiKeys?.totalCount ?? 0;
  });
