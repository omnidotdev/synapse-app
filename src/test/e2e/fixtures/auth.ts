/** Cookie name used by the E2E auth bypass in `fetchSession` */
export const TEST_AUTH_COOKIE = "__test_auth";

/** Test user returned by the auth bypass */
export const TEST_USER = {
  id: "test-user-id",
  name: "Test User",
  email: "test@omni.dev",
} as const;
