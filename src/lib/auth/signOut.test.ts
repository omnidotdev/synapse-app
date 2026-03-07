import { beforeEach, describe, expect, mock, test } from "bun:test";

import signOut from "./signOut";

const IDP_LOGOUT_URL =
  "https://identity.omni.dev/oauth2/endsession?client_id=test";

const mockClearSession = mock(
  (): Promise<{ idpLogoutUrl: string | null }> =>
    Promise.resolve({ idpLogoutUrl: IDP_LOGOUT_URL }),
);

describe("signOut", () => {
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

  test("calls signOutLocal to clear server session", async () => {
    await signOut(mockClearSession);
    expect(mockClearSession).toHaveBeenCalledTimes(1);
  });

  test("redirects to IDP logout URL when available", async () => {
    await signOut(mockClearSession);
    expect(window.location.href).toBe(IDP_LOGOUT_URL);
  });

  test("falls back to home when IDP logout URL is unavailable", async () => {
    mockClearSession.mockResolvedValueOnce({
      idpLogoutUrl: null,
    });

    await signOut(mockClearSession);
    expect(window.location.href).toBe("/");
  });
});
