import { describe, expect, test } from "bun:test";

import { manageSubscriptionUrl, returnUrl, upgradePlanUrl } from "./hubLinks";

const HUB = "https://account.omni.dev";
const SYNAPSE = "https://synapse.omni.dev";

const params = (url: string) => Object.fromEntries(new URL(url).searchParams);

describe("returnUrl", () => {
  test("joins the base URL and path", () => {
    expect(returnUrl(`${SYNAPSE}/`, "/pricing")).toBe(`${SYNAPSE}/pricing`);
  });

  test("falls back to the browser origin without a base URL", () => {
    const realWindow = globalThis.window;
    // Stand in for a browser at Synapse's origin
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: { location: { origin: SYNAPSE } },
    });

    try {
      expect(returnUrl("", "/pricing")).toBe(`${SYNAPSE}/pricing`);
    } finally {
      Object.defineProperty(globalThis, "window", {
        configurable: true,
        value: realWindow,
      });
    }
  });
});

describe("upgradePlanUrl", () => {
  test("buys the plan on the account hub and returns to the workspace's billing", () => {
    const url = upgradePlanUrl(HUB, SYNAPSE, {
      plan: "pro",
      interval: "month",
      workspaceSlug: "acme",
    });

    expect(url.startsWith(`${HUB}/billing?`)).toBe(true);
    expect(params(url)).toEqual({
      product: "synapse",
      plan: "pro",
      interval: "month",
      workspace: "acme",
      return: `${SYNAPSE}/@acme/~/billing`,
    });
  });

  test("lets the hub ask for the workspace and returns to pricing", () => {
    expect(
      params(upgradePlanUrl(HUB, SYNAPSE, { plan: "team", interval: "year" })),
    ).toEqual({
      product: "synapse",
      plan: "team",
      interval: "year",
      return: `${SYNAPSE}/pricing`,
    });
  });

  test("opens the hub as the signed-in account", () => {
    expect(
      params(
        upgradePlanUrl(HUB, SYNAPSE, {
          plan: "pro",
          interval: "month",
          workspaceSlug: "acme",
          loginHint: "user-123",
        }),
      ),
    ).toHaveProperty("login_hint", "user-123");
    expect(
      params(upgradePlanUrl(HUB, SYNAPSE, { plan: "pro", interval: "month" })),
    ).not.toHaveProperty("login_hint");
  });

  test("is empty when no account hub is configured", () => {
    expect(
      upgradePlanUrl(undefined, SYNAPSE, { plan: "pro", interval: "month" }),
    ).toBe("");
  });
});

describe("manageSubscriptionUrl", () => {
  test("manages the workspace's plan and returns to its billing page", () => {
    const url = manageSubscriptionUrl(HUB, SYNAPSE, { workspaceSlug: "acme" });

    expect(url.startsWith(`${HUB}/billing?`)).toBe(true);
    expect(params(url)).toEqual({
      product: "synapse",
      workspace: "acme",
      manage: "1",
      return: `${SYNAPSE}/@acme/~/billing`,
    });
  });

  test("returns to the page the user left", () => {
    expect(
      params(
        manageSubscriptionUrl(HUB, SYNAPSE, {
          workspaceSlug: "acme",
          returnPath: "/profile",
        }),
      ),
    ).toEqual({
      product: "synapse",
      workspace: "acme",
      manage: "1",
      return: `${SYNAPSE}/profile`,
    });
  });

  test("opens the hub as the signed-in account", () => {
    expect(
      params(
        manageSubscriptionUrl(HUB, SYNAPSE, {
          workspaceSlug: "acme",
          loginHint: "user-123",
        }),
      ),
    ).toHaveProperty("login_hint", "user-123");
    expect(
      params(manageSubscriptionUrl(HUB, SYNAPSE, { workspaceSlug: "acme" })),
    ).not.toHaveProperty("login_hint");
  });

  test("is empty when no account hub is configured", () => {
    expect(manageSubscriptionUrl("", SYNAPSE, { workspaceSlug: "acme" })).toBe(
      "",
    );
  });
});
