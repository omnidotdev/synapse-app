import { createAuthzProvider } from "@omnidotdev/providers/authz";

import { AUTHZ_API_URL, AUTHZ_ENABLED } from "@/lib/config/env.config";

import type { AuthzProvider } from "@omnidotdev/providers/authz";

let instance: AuthzProvider | null | undefined;

/** Lazily instantiate the authz provider on first use */
const getAuthz = (): AuthzProvider | null => {
  if (instance !== undefined) return instance;

  if (!AUTHZ_API_URL || AUTHZ_ENABLED !== "true") {
    instance = null;
    return null;
  }

  instance = createAuthzProvider({ apiUrl: AUTHZ_API_URL });
  return instance;
};

export default getAuthz;
