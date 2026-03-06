import { createMiddleware } from "@tanstack/react-start";

import { fetchSession } from "@/server/functions/auth";

/**
 * Authentication middleware.
 * Validates the user session and adds it to the context.
 * Throws if the user is not authenticated.
 */
export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const { session, organizations } = await fetchSession();

  if (!session) throw new Error("Unauthorized");

  const { accessToken } = session;
  if (!accessToken) {
    throw new Error(
      "Session expired. Please sign out and sign in again to reconnect",
    );
  }

  return next({
    context: { session: { ...session, accessToken }, organizations },
  });
});
