import { describe, expect, it } from "bun:test";

import getMaxApiKeys from "./getMaxApiKeys";

describe("getMaxApiKeys", () => {
  it("returns 3 when entitlements is null", () => {
    expect(getMaxApiKeys(null)).toBe(3);
  });

  it("returns 3 when no max_api_keys entitlement exists", () => {
    expect(getMaxApiKeys({ entitlements: [] })).toBe(3);
  });

  it("returns null for unlimited (-1)", () => {
    expect(
      getMaxApiKeys({
        entitlements: [{ featureKey: "max_api_keys", value: "-1" }],
      }),
    ).toBeNull();
  });

  it("parses string value", () => {
    expect(
      getMaxApiKeys({
        entitlements: [{ featureKey: "max_api_keys", value: "25" }],
      }),
    ).toBe(25);
  });

  it("handles numeric value (non-string)", () => {
    expect(
      getMaxApiKeys({
        entitlements: [{ featureKey: "max_api_keys", value: 3 }],
      }),
    ).toBe(3);
  });

  it("handles numeric unlimited (-1 as number)", () => {
    expect(
      getMaxApiKeys({
        entitlements: [{ featureKey: "max_api_keys", value: -1 }],
      }),
    ).toBeNull();
  });

  it("handles quoted string value", () => {
    expect(
      getMaxApiKeys({
        entitlements: [{ featureKey: "max_api_keys", value: '"25"' }],
      }),
    ).toBe(25);
  });
});
