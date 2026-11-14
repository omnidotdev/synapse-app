import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { authMiddleware } from "@/server/middleware";
import { graphql } from "./graphql";

import type { ApiKey, CreateApiKeyResult } from "./apiKeys";

const workspaceIdSchema = z.object({
  workspaceId: z.string().uuid(),
});

/**
 * List the active API keys that belong to a workspace (every member's)
 */
export const listWorkspaceApiKeys = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data) => workspaceIdSchema.parse(data))
  .handler(async ({ data, context }): Promise<ApiKey[]> => {
    const { accessToken } = context.session;

    const result = await graphql<{
      observer: { apiKeys: ApiKey[] };
    }>(
      accessToken,
      `query WorkspaceApiKeys($organizationId: UUID!) {
        observer {
          apiKeys(organizationId: $organizationId) {
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
      }`,
      { organizationId: data.workspaceId },
    );

    return result.observer?.apiKeys ?? [];
  });

const createKeySchema = z.object({
  name: z.string().min(1).max(100),
  workspaceId: z.string().uuid(),
});

/**
 * Create a new API key in a workspace, which it then bills
 */
export const createWorkspaceApiKey = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data) => createKeySchema.parse(data))
  .handler(async ({ data, context }): Promise<CreateApiKeyResult> => {
    const { accessToken } = context.session;

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
          mode: "byok",
          organizationId: data.workspaceId,
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
export const revokeWorkspaceApiKey = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data) => revokeKeySchema.parse(data))
  .handler(async ({ data, context }): Promise<boolean> => {
    const { accessToken } = context.session;

    const result = await graphql<{ revokeApiKey: boolean }>(
      accessToken,
      `mutation RevokeApiKey($id: UUID!) {
        revokeApiKey(id: $id)
      }`,
      { id: data.id },
    );

    return result.revokeApiKey;
  });
