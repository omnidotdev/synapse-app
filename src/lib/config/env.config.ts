/**
 * Environment variables.
 */
// Build-time vars take precedence to prevent SSR hydration mismatch
const env =
  typeof window === "undefined"
    ? { ...process.env, ...import.meta.env }
    : import.meta.env;

export const {
  // core
  VITE_BASE_URL: BASE_URL,
  VITE_API_BASE_URL: API_BASE_URL,
  VITE_AUTH_BASE_URL: AUTH_BASE_URL,
  // auth (server-side secrets)
  AUTH_CLIENT_ID,
  AUTH_CLIENT_SECRET,

  // billing
  VITE_BILLING_BASE_URL: BILLING_BASE_URL,
  BILLING_SERVICE_API_KEY,
  // authorization
  VITE_AUTHZ_API_URL: AUTHZ_API_URL,
  VITE_AUTHZ_ENABLED: AUTHZ_ENABLED,
  // synapse (server-only, no VITE_ prefix so it reads at runtime, not build time)
  SYNAPSE_API_URL,
} = env;

// Internal auth URL for server-to-server communication (Docker service name)
// Falls back to AUTH_BASE_URL for non-Docker environments
export const AUTH_INTERNAL_URL =
  typeof window === "undefined"
    ? process.env.AUTH_INTERNAL_URL || AUTH_BASE_URL
    : AUTH_BASE_URL;

export const API_GRAPHQL_URL = `${API_BASE_URL}/graphql`;

// environment helpers
export const isDevEnv = import.meta.env.DEV;

// Warn if authZ is enabled but the API URL is missing (fail-open risk)
if (AUTHZ_ENABLED === "true" && !AUTHZ_API_URL) {
  console.warn(
    "[AuthZ] VITE_AUTHZ_ENABLED is true but VITE_AUTHZ_API_URL is not set, authorization checks will be skipped",
  );
}

// Startup warnings for optional integrations (server-only: VITE_ vars are
// build-time constants on the client, and SYNAPSE_API_URL has no VITE_ prefix)
if (typeof window === "undefined") {
  if (!BILLING_BASE_URL)
    console.warn("BILLING_BASE_URL not set, billing disabled");
  if (!AUTHZ_API_URL)
    console.warn("AUTHZ_API_URL not set, authorization disabled");
  if (!SYNAPSE_API_URL)
    console.warn("SYNAPSE_API_URL not set, notifications disabled");
}
