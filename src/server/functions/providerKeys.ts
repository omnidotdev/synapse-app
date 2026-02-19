import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { authMiddleware } from "@/server/middleware";

import { graphql } from "./graphql";

interface ProviderKey {
  id: string;
  provider: string;
  keyHint: string;
  modelPreference: string | null;
  createdAt: string;
}

interface SetProviderKeyResult {
  id: string;
  provider: string;
  keyHint: string;
  modelPreference: string | null;
}

/**
 * List provider keys for the current user
 */
export const listProviderKeys = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<ProviderKey[]> => {
    const accessToken = context.session.accessToken;
    if (!accessToken) throw new Error("Access token required");

    const data = await graphql<{ myProviderKeys: ProviderKey[] }>(
      accessToken,
      `query {
        myProviderKeys {
          id
          provider
          keyHint
          modelPreference
          createdAt
        }
      }`,
    );

    return data.myProviderKeys ?? [];
  });

const setKeySchema = z.object({
  provider: z.enum(["openai", "anthropic", "openrouter"]),
  key: z.string().min(1),
  modelPreference: z.string().optional(),
});

/**
 * Set (upsert) a provider key for the current user
 */
export const setProviderKey = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data) => setKeySchema.parse(data))
  .handler(async ({ data, context }): Promise<SetProviderKeyResult> => {
    const accessToken = context.session.accessToken;
    if (!accessToken) throw new Error("Access token required");

    const result = await graphql<{ setProviderKey: SetProviderKeyResult }>(
      accessToken,
      `mutation SetProviderKey($input: SetProviderKeyInput!) {
        setProviderKey(input: $input) {
          id
          provider
          keyHint
          modelPreference
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
    const accessToken = context.session.accessToken;
    if (!accessToken) throw new Error("Access token required");

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
