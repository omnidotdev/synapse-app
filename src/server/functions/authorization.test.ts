import { beforeEach, describe, expect, it, mock } from "bun:test";

const checkPermission = mock(async () => true);

mock.module("@/lib/providers/authz", () => ({
  default: () => ({ checkPermission }),
}));

const { requireEntityAccess, wardenSubject } = await import("./authorization");

const context = {
  session: { user: { id: "better-auth-id", identityProviderId: "idp-user" } },
  organizations: [
    { id: "personal-ws", type: "personal" },
    { id: "team-ws", type: "team" },
  ],
};

beforeEach(() => {
  checkPermission.mockClear();
  checkPermission.mockImplementation(async () => true);
});

describe("wardenSubject", () => {
  it("is the identity provider user id, never the local Better Auth id", () => {
    expect(wardenSubject(context.session)).toBe("idp-user");
  });

  it("refuses a session without an identity provider id", () => {
    expect(() => wardenSubject({ user: { identityProviderId: null } })).toThrow(
      "Forbidden",
    );
  });
});

describe("requireEntityAccess", () => {
  it("lets a user act on their own user entity only", async () => {
    await expect(
      requireEntityAccess(context, "user", "idp-user", "member"),
    ).resolves.toBeUndefined();
    await expect(
      requireEntityAccess(context, "user", "someone-else", "member"),
    ).rejects.toThrow("Forbidden");
    expect(checkPermission).not.toHaveBeenCalled();
  });

  it("lets a user act on their own personal workspace", async () => {
    await expect(
      requireEntityAccess(context, "organization", "personal-ws", "admin"),
    ).resolves.toBeUndefined();
    expect(checkPermission).not.toHaveBeenCalled();
  });

  it("asks Warden about any other workspace, as the identity provider user", async () => {
    await requireEntityAccess(context, "organization", "team-ws", "admin");

    expect(checkPermission).toHaveBeenCalledWith(
      "idp-user",
      "organization",
      "team-ws",
      "admin",
    );
  });

  it("denies when Warden denies", async () => {
    checkPermission.mockImplementation(async () => false);

    await expect(
      requireEntityAccess(context, "organization", "team-ws", "member"),
    ).rejects.toThrow("Forbidden");
  });
});
