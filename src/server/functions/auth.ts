import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest, setCookie } from "@tanstack/react-start/server";

import auth from "@/lib/auth/auth";
import { authCache } from "@/lib/auth/authCache";
import { getAuth } from "@/lib/auth/getAuth";
import { isSessionDegraded } from "@/lib/auth/sessionState";
import {
  AUTH_BASE_URL,
  AUTH_CLIENT_ID,
  BASE_URL,
} from "@/lib/config/env.config";

/**
 * Resolve the current session and its organizations.
 *
 * `forceRefreshOrgs` bypasses getAuth's in-memory org display cache and
 * re-hydrates the list live from userinfo, so a workspace created out-of-band
 * (in the account portal) is reflected immediately instead of after the cache
 * TTL. The fresh result is written back, so subsequent normal reads benefit too.
 */
const loadSession = async (forceRefreshOrgs = false) => {
  const request = getRequest();
  const session = await getAuth(request, { forceRefreshOrgs });

  if (!session) {
    return { session: null, organizations: [], authDegraded: false };
  }

  // A degraded session is authenticated (getAuth returned it) but carries no
  // access token: the refresh-token grant failed, so getAuth served the session
  // without a fresh token and userinfo org hydration was skipped, leaving
  // organizations empty. This is distinct from a genuinely organization-less
  // user (who has a valid access token), and the organizations page uses it to
  // prompt a re-login instead of the silent "No organizations yet" empty state
  return {
    session,
    organizations: session.organizations,
    authDegraded: isSessionDegraded(session),
  };
};

/**
 * Fetch the current user session.
 * Returns session with user info if authenticated, null otherwise.
 */
export const fetchSession = createServerFn().handler(() => loadSession());

/**
 * Fetch the session with a live organization re-hydration (bypasses the org
 * display cache). Used by the workspaces list so a workspace just created in
 * the account portal appears without waiting out the cache TTL.
 */
export const fetchFreshSession = createServerFn().handler(() =>
  loadSession(true),
);

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
        body: { useAccountCookie: true },
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
