import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";

const IDP_LOGOUT_URL =
  "https://identity.omni.dev/oauth2/endsession?client_id=test";

const mockSignOutLocal = mock(() =>
  Promise.resolve({ idpLogoutUrl: IDP_LOGOUT_URL }),
);

mock.module("@/server/functions/auth", () => ({
  signOutLocal: mockSignOutLocal,
}));

const { default: signOut } = await import("./signOut");

describe("signOut", () => {
  beforeEach(() => {
    mockSignOutLocal.mockClear();
    mockSignOutLocal.mockResolvedValue({ idpLogoutUrl: IDP_LOGOUT_URL });
    // Replace window.location with a plain object so href assignment
    // doesn't trigger Happy DOM navigation (which resets to about:blank)
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
      configurable: true,
    });
  });

  test("calls signOutLocal to clear server session", async () => {
    await signOut();
    expect(mockSignOutLocal).toHaveBeenCalledTimes(1);
  });

  test("redirects to IDP logout URL when available", async () => {
    await signOut();
    expect(window.location.href).toBe(IDP_LOGOUT_URL);
  });

  test("falls back to home when IDP logout URL is unavailable", async () => {
    mockSignOutLocal.mockResolvedValueOnce({
      idpLogoutUrl: undefined as unknown as string,
    });

    await signOut();
    expect(window.location.href).toBe("/");
  });
});
