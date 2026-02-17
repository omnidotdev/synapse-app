import { createAuthzProvider } from "@omnidotdev/providers";

import { AUTHZ_API_URL } from "@/lib/config/env.config";

import type { AuthzProvider } from "@omnidotdev/providers";

let instance: AuthzProvider | undefined;

/** Lazily instantiate the authz provider on first use */
const getAuthz = (): AuthzProvider => {
  if (!instance) {
    instance = createAuthzProvider({
      apiUrl: AUTHZ_API_URL,
    });
  }

  return instance;
};

export default getAuthz;
