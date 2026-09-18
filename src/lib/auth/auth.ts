import { getCookie } from "@tanstack/react-start/server";
import { betterAuth } from "better-auth";
import { customSession, genericOAuth } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { authCache } from "@/lib/auth/authCache";
import {
  AUTH_BASE_URL,
  AUTH_CLIENT_ID,
  AUTH_CLIENT_SECRET,
  AUTH_INTERNAL_URL,
  BASE_URL,
} from "@/lib/config/env.config";

const { AUTH_SECRET } = process.env;

// Build genericOAuth config array based on available credentials
const oauthConfigs: Parameters<typeof genericOAuth>[0]["config"] = [];

if (AUTH_CLIENT_ID && AUTH_CLIENT_SECRET && AUTH_BASE_URL) {
  oauthConfigs.push({
    providerId: "omni",
    clientId: AUTH_CLIENT_ID,
    clientSecret: AUTH_CLIENT_SECRET,
    // Set URLs explicitly instead of using discoveryUrl — BA overrides
    // tokenUrl with the discovery doc's token_endpoint, which uses the
    // external URL unreachable from inside Docker
    authorizationUrl: `${AUTH_BASE_URL}/oauth2/authorize`,
    tokenUrl: `${AUTH_INTERNAL_URL}/oauth2/token`,
    userInfoUrl: `${AUTH_INTERNAL_URL}/userinfo`,
    scopes: ["openid", "profile", "email", "offline_access", "organization"],
    accessType: "offline",
    pkce: true,
    // better-auth 1.7 tightened the mapped-user return type; the IDP's custom
    // `email_verified`/`picture` claims arrive untyped, so coerce them
    mapProfileToUser: (profile) => ({
      name: profile.name,
      email: profile.email,
      emailVerified:
        typeof profile.email_verified === "boolean"
          ? profile.email_verified
          : undefined,
      image: typeof profile.picture === "string" ? profile.picture : undefined,
    }),
  });
}

// Build plugins array
const plugins = [];

if (oauthConfigs.length > 0) {
  plugins.push(genericOAuth({ config: oauthConfigs }));
}

// NB: must be the last plugin in the array
plugins.push(
  customSession(async ({ user, session }) => {
    let identityProviderId: string | null = null;

    const cachedValue = getCookie(authCache.cookieName);
    if (cachedValue) {
      const cached = await authCache.decrypt(cachedValue);
      if (cached) {
        identityProviderId = cached.identityProviderId;
      }
    }

    return {
      user: {
        ...user,
        identityProviderId,
      },
      session,
    };
  }),
);

plugins.push(tanstackStartCookies());

/**
 * Auth server client.
 */
const auth = betterAuth({
  baseURL: BASE_URL,
  basePath: "/api/auth",
  secret: AUTH_SECRET,
  trustedOrigins: BASE_URL ? [BASE_URL] : [],
  session: {
    // Extend session expiration to 30 days
    expiresIn: 60 * 60 * 24 * 30,
    // Refresh session if older than 1 day
    updateAge: 60 * 60 * 24,
    // Enable cookie caching for stateless session validation
    cookieCache: {
      enabled: true,
      // Match session expiration so OAuth tokens (stored in account_data cookie
      // with the same maxAge) don't expire before the session itself
      maxAge: 60 * 60 * 24 * 30,
      // Use encrypted JWE for security
      strategy: "jwe",
      // Auto-refresh cookie before expiry
      refreshCache: true,
    },
  },
  account: {
    // Store OAuth tokens in signed cookie for stateless mode
    storeAccountCookie: true,
  },
  advanced: {
    // Use custom cookie prefix to avoid collision with IDP cookies
    cookiePrefix: "synapse",
  },
  plugins,
});

export default auth;
