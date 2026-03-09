import { API_BASE_URL, SYNAPSE_API_URL } from "@/lib/config/env.config";

const INTERNAL_URL = SYNAPSE_API_URL ? `${SYNAPSE_API_URL}/graphql` : undefined;
const PUBLIC_URL = `${API_BASE_URL}/graphql`;

/**
 * Execute a GraphQL query against synapse-api.
 * Tries the internal Railway URL first for lower latency, falls back to the
 * public URL if the internal network is unreachable.
 */
export const graphql = async <T>(
  accessToken: string,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
  const body = JSON.stringify({ query, variables });

  let res: Response;

  if (INTERNAL_URL) {
    try {
      res = await fetch(INTERNAL_URL, { method: "POST", headers, body });
    } catch {
      // Internal networking unavailable, fall back to public URL
      res = await fetch(PUBLIC_URL, { method: "POST", headers, body });
    }
  } else {
    res = await fetch(PUBLIC_URL, { method: "POST", headers, body });
  }

  if (!res.ok) {
    throw new Error(`GraphQL request failed: ${res.status}`);
  }

  const json = await res.json();

  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }

  return json.data;
};
