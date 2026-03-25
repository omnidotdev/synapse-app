import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest, setCookie } from "@tanstack/react-start/server";

import auth from "@/lib/auth/auth";
import { authCache } from "@/lib/auth/authCache";
import { getAuth } from "@/lib/auth/getAuth";
import {
  AUTH_BASE_URL,
  AUTH_CLIENT_ID,
  BASE_URL,
} from "@/lib/config/env.config";

/**
 * Fetch the current user session.
 * Returns session with user info if authenticated, null otherwise.
 */
// @ts-expect-error BA 1.5 widens user index type to `unknown`, incompatible with TanStack `{}`
export const fetchSession = createServerFn().handler(async () => {
  const request = getRequest();
  const session = await getAuth(request);

  if (!session) {
    return { session: null, organizations: [] };
  }

  return {
    session,
    organizations: session.organizations,
  };
});

const clearAuthCacheCookie = () => {
  setCookie(authCache.cookieName, "", { maxAge: 0, path: "/" });
};

/**
 * Sign out and redirect to home page.
 * @knipignore - Exported for downstream use
 */
export const signOutAndRedirect = createServerFn({ method: "POST" }).handler(
  async () => {
    const headers = getRequest().headers;
    try {
      await auth.api.signOut({ headers });
    } catch {
      // Session may already be cleared by getAuth invalid_grant handler
    }
    clearAuthCacheCookie();
    throw redirect({ to: "/" });
  },
);

/**
 * Build the IDP end_session URL for federated logout.
 */
export function getIdpLogoutUrl(idTokenHint?: string): string | null {
  if (!AUTH_BASE_URL || !AUTH_CLIENT_ID || !BASE_URL || !idTokenHint) {
    return null;
  }

  const endSessionUrl = new URL(`${AUTH_BASE_URL}/oauth2/end-session`);
  endSessionUrl.searchParams.set("client_id", AUTH_CLIENT_ID);
  endSessionUrl.searchParams.set("post_logout_redirect_uri", BASE_URL);
  endSessionUrl.searchParams.set("id_token_hint", idTokenHint);

  return endSessionUrl.toString();
}

/**
 * Sign out from the local session (server-side).
 */
export const signOutLocal = createServerFn({ method: "POST" }).handler(
  async () => {
    const request = getRequest();
    const headers = request.headers;

    let idToken: string | undefined;
    try {
      const tokenResult = await auth.api.getAccessToken({
        body: { providerId: "omni" },
        headers,
      });
      idToken = tokenResult?.idToken;
    } catch {
      // Token may already be expired
    }

    try {
      await auth.api.signOut({ headers });
    } catch {
      // Session may already be cleared by getAuth invalid_grant handler
    }
    clearAuthCacheCookie();

    return { idpLogoutUrl: getIdpLogoutUrl(idToken) };
  },
);
