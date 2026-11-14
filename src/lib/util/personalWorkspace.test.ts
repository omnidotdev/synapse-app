import { describe, expect, it } from "bun:test";

import getPersonalWorkspaceId from "./personalWorkspace";

describe("getPersonalWorkspaceId", () => {
  it("picks the personal workspace among team workspaces", () => {
    expect(
      getPersonalWorkspaceId([
        { id: "team-1", type: "team" },
        { id: "personal-1", type: "personal" },
      ]),
    ).toBe("personal-1");
  });

  it("is null without a personal workspace", () => {
    expect(getPersonalWorkspaceId([{ id: "team-1", type: "team" }])).toBeNull();
    expect(getPersonalWorkspaceId([])).toBeNull();
  });
});
