import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { authMiddleware } from "@/server/middleware";
import { graphql } from "./graphql";

/** How an API key was provisioned */
type ApiKeyMode = "manual" | "managed";

interface LinkedProvider {
  id: string;
  provider: string;
  keyHint: string;
}

interface ApiKey {
  id: string;
  name: string;
  keyHint: string;
  mode: ApiKeyMode;
  linkedProviders: LinkedProvider[];
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
 * List active API keys for the current user
 */
export const listApiKeys = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<ApiKey[]> => {
    const { accessToken } = context.session;

    const data = await graphql<{
      observer: { apiKeys: ApiKey[] };
    }>(
      accessToken,
      `query {
        observer {
          apiKeys {
            id
            name
            keyHint
            mode
            linkedProviders {
              id
              provider
              keyHint
            }
            createdAt
            lastUsedAt
            expiresAt
            revokedAt
          }
        }
      }`,
    );

    return data.observer?.apiKeys ?? [];
  });

const createKeySchema = z.object({
  name: z.string().min(1).max(100),
});

/**
 * Create a new API key
 */
export const createApiKey = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data) => createKeySchema.parse(data))
  .handler(async ({ data, context }): Promise<CreateApiKeyResult> => {
    const { accessToken } = context.session;

    const result = await graphql<{ generateApiKey: CreateApiKeyResult }>(
      accessToken,
      `mutation GenerateApiKey($input: GenerateApiKeyInput!) {
        generateApiKey(input: $input) {
          rawKey
          apiKeyId
          keyHint
        }
      }`,
      { input: { name: data.name, mode: "manual" } },
    );

    return result.generateApiKey;
  });

const linkProviderSchema = z.object({
  apiKeyId: z.string().uuid(),
  providerKeyId: z.string().uuid(),
});

/**
 * Link a provider key to a Synapse API key
 */
export const linkProviderKey = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data) => linkProviderSchema.parse(data))
  .handler(async ({ data, context }): Promise<boolean> => {
    const { accessToken } = context.session;

    const result = await graphql<{ linkProviderKey: boolean }>(
      accessToken,
      `mutation LinkProviderKey($apiKeyId: UUID!, $providerKeyId: UUID!) {
        linkProviderKey(apiKeyId: $apiKeyId, providerKeyId: $providerKeyId)
      }`,
      data,
    );

    return result.linkProviderKey;
  });

/**
 * Unlink a provider key from a Synapse API key
 */
export const unlinkProviderKey = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data) => linkProviderSchema.parse(data))
  .handler(async ({ data, context }): Promise<boolean> => {
    const { accessToken } = context.session;

    const result = await graphql<{ unlinkProviderKey: boolean }>(
      accessToken,
      `mutation UnlinkProviderKey($apiKeyId: UUID!, $providerKeyId: UUID!) {
        unlinkProviderKey(apiKeyId: $apiKeyId, providerKeyId: $providerKeyId)
      }`,
      data,
    );

    return result.unlinkProviderKey;
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

export type { ApiKey, ApiKeyMode, CreateApiKeyResult, LinkedProvider };
