import {
  afterAll,
  beforeEach,
  describe,
  expect,
  mock,
  spyOn,
  test,
} from "bun:test";

import * as TanStackRouter from "@tanstack/react-router";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import WorkspaceSwitcher from "./WorkspaceSwitcher";

import type { Workspace } from "@/lib/context";

const workspace = (
  id: string,
  slug: string,
  type: "personal" | "team",
): Workspace => ({
  id,
  name: slug === "brian" ? "Brian" : "Acme",
  slug,
  logo: null,
  type,
  roles: ["owner"],
  teams: [],
});

const WORKSPACES = [
  workspace("org-1", "brian", "personal"),
  workspace("org-2", "acme", "team"),
];

const navigate = mock();
let workspaceSlug: string | undefined;
let fullPaths: string[] = [];
let organizations: Workspace[] = WORKSPACES;

const spies = [
  spyOn(TanStackRouter, "useRouter").mockReturnValue({
    routesByPath: { "/@{$workspaceSlug}/~/keys": {} },
  } as unknown as ReturnType<typeof TanStackRouter.useRouter>),
  spyOn(TanStackRouter, "useNavigate").mockReturnValue(
    navigate as unknown as ReturnType<typeof TanStackRouter.useNavigate>,
  ),
  spyOn(TanStackRouter, "useParams").mockImplementation(
    () => ({ workspaceSlug }) as never,
  ),
  // biome-ignore lint/suspicious/noExplicitAny: minimal matches select stub
  spyOn(TanStackRouter, "useMatches").mockImplementation((opts?: any) => {
    const matches = fullPaths.map((fullPath) => ({ fullPath }));
    return opts?.select ? opts.select(matches) : matches;
  }),
  spyOn(TanStackRouter, "useRouteContext").mockImplementation(
    () => ({ organizations }) as never,
  ),
];

afterAll(() => {
  for (const spy of spies) spy.mockRestore();
});

beforeEach(() => {
  cleanup();
  navigate.mockClear();
  workspaceSlug = "brian";
  fullPaths = ["/", "/@{$workspaceSlug}", "/@{$workspaceSlug}/~/keys"];
  organizations = WORKSPACES;
});

// Each pointer move lands somewhere new, since the menu ignores a pointer
// that has not moved since the last one
let pointerX = 0;

const openAndPick = async (name: string) => {
  render(<WorkspaceSwitcher />);
  const trigger = screen.getByRole("button", { name: /switch workspace/ });
  fireEvent.click(trigger);
  const items = await screen.findAllByRole("menuitem");
  const item = items.find((entry) => entry.textContent?.includes(name));
  if (!item) throw new Error(`no menu item for ${name}`);
  // The menu selects the highlighted entry, so highlight it before clicking
  await act(async () => {
    fireEvent.pointerMove(item, { pointerType: "mouse", clientX: ++pointerX });
  });
  await act(async () => {
    fireEvent.click(item);
  });
};

describe("WorkspaceSwitcher", () => {
  test("shows the workspace in the URL as current", () => {
    render(<WorkspaceSwitcher />);

    expect(
      screen.getByRole("button", { name: "Brian, switch workspace" }),
    ).toBeDefined();
  });

  test("renders nothing off a workspace's pages", () => {
    workspaceSlug = undefined;
    const { container } = render(<WorkspaceSwitcher />);

    expect(container.innerHTML).toBe("");
  });

  test("renders nothing without workspaces", () => {
    organizations = [];
    const { container } = render(<WorkspaceSwitcher />);

    expect(container.innerHTML).toBe("");
  });

  test("switching keeps the same section in the other workspace", async () => {
    await openAndPick("Acme");

    expect(navigate).toHaveBeenCalledWith({
      to: "/@{$workspaceSlug}/~/keys",
      params: { workspaceSlug: "acme" },
    });
  });

  test("switching from a page about one key opens the other workspace's keys", async () => {
    fullPaths = ["/", "/@{$workspaceSlug}", "/@{$workspaceSlug}/~/keys/$keyId"];
    await openAndPick("Acme");

    expect(navigate).toHaveBeenCalledWith({
      to: "/@{$workspaceSlug}/~/keys",
      params: { workspaceSlug: "acme" },
    });
  });

  test("lists every workspace from the all workspaces entry", async () => {
    await openAndPick("All workspaces");

    expect(navigate).toHaveBeenCalledWith({ to: "/organizations" });
  });
});
