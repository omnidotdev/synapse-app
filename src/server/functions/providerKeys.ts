import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { authMiddleware } from "@/server/middleware";
import { graphql } from "./graphql";

interface ProviderKey {
  id: string;
  provider: string;
  keyHint: string;
  createdAt: string;
}

interface SetProviderKeyResult {
  id: string;
  provider: string;
  keyHint: string;
}

/**
 * List provider keys for the current user
 */
export const listProviderKeys = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<ProviderKey[]> => {
    const { accessToken } = context.session;

    const data = await graphql<{
      observer: { providerKeys: ProviderKey[] } | null;
    }>(
      accessToken,
      `query {
        observer {
          providerKeys {
            id
            provider
            keyHint
            createdAt
          }
        }
      }`,
    );

    return data.observer?.providerKeys ?? [];
  });

const setKeySchema = z.object({
  provider: z.enum(["openai", "anthropic", "google", "nvidia", "deepgram", "elevenlabs", "groq", "mistral", "openrouter"]),
  key: z.string().min(1),
});

/**
 * Set (upsert) a provider key for the current user
 */
export const setProviderKey = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data) => setKeySchema.parse(data))
  .handler(async ({ data, context }): Promise<SetProviderKeyResult> => {
    const { accessToken } = context.session;

    const result = await graphql<{ setProviderKey: SetProviderKeyResult }>(
      accessToken,
      `mutation SetProviderKey($input: SetProviderKeyInput!) {
        setProviderKey(input: $input) {
          id
          provider
          keyHint
        }
      }`,
      { input: data },
    );

    return result.setProviderKey;
  });

const removeKeySchema = z.object({
  id: z.string().uuid(),
});

/**
 * Remove a provider key by ID
 */
export const removeProviderKey = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data) => removeKeySchema.parse(data))
  .handler(async ({ data, context }): Promise<boolean> => {
    const { accessToken } = context.session;

    const result = await graphql<{ removeProviderKey: boolean }>(
      accessToken,
      `mutation RemoveProviderKey($id: UUID!) {
        removeProviderKey(id: $id)
      }`,
      { id: data.id },
    );

    return result.removeProviderKey;
  });

export type { ProviderKey, SetProviderKeyResult };
