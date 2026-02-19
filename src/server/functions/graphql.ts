import { SYNAPSE_API_URL } from "@/lib/config/env.config";

export const API_GRAPHQL_URL = `${SYNAPSE_API_URL}/graphql`;

/**
 * Execute a GraphQL query against synapse-api
 */
export const graphql = async <T>(
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
