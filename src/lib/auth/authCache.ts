import { createAuthCache, createOidcClient } from "@omnidotdev/providers/auth";

import { AUTH_INTERNAL_URL } from "@/lib/config/env.config";

// biome-ignore lint/style/noNonNullAssertion: guarded by OAuth config check in auth.ts
export const oidc = createOidcClient({ authBaseUrl: AUTH_INTERNAL_URL! });
export const authCache = createAuthCache({ appName: "synapse" });
