import { API_BASE_URL } from "@/lib/config/env.config";

/**
 * Resolve the GraphQL URL at call time so runtime env vars are respected.
 * Prefers SYNAPSE_API_URL (server-only, for Railway internal networking),
 * falls back to the public API_BASE_URL.
 */
const getGraphQLUrl = () => {
  const base = process.env.SYNAPSE_API_URL || API_BASE_URL;
  return `${base}/graphql`;
};

/**
 * Execute a GraphQL query against synapse-api
 */
export const graphql = async <T>(
  accessToken: string,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> => {
  const url = getGraphQLUrl();

  const res = await fetch(url, {
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
