import { createAuthzProvider } from "@omnidotdev/providers/authz";

import {
  AUTHZ_API_URL,
  AUTHZ_ENABLED,
  AUTHZ_SERVICE_KEY,
} from "@/lib/config/env.config";

import type { AuthzProvider } from "@omnidotdev/providers/authz";

let instance: AuthzProvider | null | undefined;

/** Lazily instantiate the authz provider on first use */
const getAuthz = (): AuthzProvider | null => {
  if (instance !== undefined) return instance;

  if (!AUTHZ_API_URL || AUTHZ_ENABLED !== "true") {
    instance = null;
    return null;
  }

  // The PDP authenticates every check with the service key
  instance = createAuthzProvider({
    apiUrl: AUTHZ_API_URL,
    serviceKey: AUTHZ_SERVICE_KEY,
  });
  return instance;
};

export default getAuthz;
