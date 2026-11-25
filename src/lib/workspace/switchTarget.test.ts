import { describe, expect, test } from "bun:test";

import { WORKSPACE_HOME, workspaceSwitchTarget } from "./switchTarget";

const routes = new Set([
  "/@{$workspaceSlug}/",
  "/@{$workspaceSlug}/items/",
  "/@{$workspaceSlug}/~/settings",
]);
const isRoute = (path: string) => routes.has(path);

describe("workspaceSwitchTarget", () => {
  test("off the workspace tree, a switch opens the workspace home", () => {
    expect(workspaceSwitchTarget(["/", "/workspaces/"], isRoute)).toBe(
      WORKSPACE_HOME,
    );
    expect(workspaceSwitchTarget([])).toBe(WORKSPACE_HOME);
  });

  test("a workspace section carries over to the other workspace", () => {
    expect(
      workspaceSwitchTarget(
        ["/", "/@{$workspaceSlug}", "/@{$workspaceSlug}/~/settings"],
        isRoute,
      ),
    ).toBe("/@{$workspaceSlug}/~/settings");
  });

  test("the workspace home stays the workspace home", () => {
    expect(
      workspaceSwitchTarget(
        ["/", "/@{$workspaceSlug}", "/@{$workspaceSlug}/"],
        isRoute,
      ),
    ).toBe("/@{$workspaceSlug}/");
  });

  test("a page about one thing backs up to the list it sits in", () => {
    expect(
      workspaceSwitchTarget(
        ["/", "/@{$workspaceSlug}/items/$itemId/edit"],
        isRoute,
      ),
    ).toBe("/@{$workspaceSlug}/items");
  });

  test("with no list route above it, a page about one thing opens the home", () => {
    expect(
      workspaceSwitchTarget(
        [
          "/",
          "/@{$workspaceSlug}",
          "/@{$workspaceSlug}/$project",
          "/@{$workspaceSlug}/$project/settings",
        ],
        isRoute,
      ),
    ).toBe(WORKSPACE_HOME);
  });

  test("a splat route counts as another param", () => {
    expect(workspaceSwitchTarget(["/", "/@{$workspaceSlug}/$"], isRoute)).toBe(
      WORKSPACE_HOME,
    );
  });
});
