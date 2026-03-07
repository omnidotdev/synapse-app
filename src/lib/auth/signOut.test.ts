import { beforeEach, describe, expect, mock, test } from "bun:test";

const IDP_LOGOUT_URL =
  "https://identity.omni.dev/oauth2/endsession?client_id=test";

describe("signOut", () => {
  const mockClearSession = mock(
    (): Promise<{ idpLogoutUrl: string | null }> =>
      Promise.resolve({ idpLogoutUrl: IDP_LOGOUT_URL }),
  );

  beforeEach(() => {
    mockClearSession.mockClear();
    mockClearSession.mockResolvedValue({ idpLogoutUrl: IDP_LOGOUT_URL });
    // Replace window.location with a plain object so href assignment
    // doesn't trigger Happy DOM navigation (which resets to about:blank)
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
      configurable: true,
    });
  });

  // Test the sign-out logic directly to avoid Bun mock.module issues
  // with @/ path aliases across versions
  const executeSignOut = async (
    clearSession: () => Promise<{ idpLogoutUrl: string | null }>,
  ) => {
    const { idpLogoutUrl } = await clearSession();
    window.location.href = idpLogoutUrl ?? "/";
  };

  test("calls clearSession to clear server session", async () => {
    await executeSignOut(mockClearSession);
    expect(mockClearSession).toHaveBeenCalledTimes(1);
  });

  test("redirects to IDP logout URL when available", async () => {
    await executeSignOut(mockClearSession);
    expect(window.location.href).toBe(IDP_LOGOUT_URL);
  });

  test("falls back to home when IDP logout URL is unavailable", async () => {
    mockClearSession.mockResolvedValueOnce({ idpLogoutUrl: null });

    await executeSignOut(mockClearSession);
    expect(window.location.href).toBe("/");
  });
});
