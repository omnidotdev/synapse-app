import { describe, expect, it } from "bun:test";

import getMaxApiKeys from "./getMaxApiKeys";

import type { EntitlementsResponse } from "@omnidotdev/providers/billing";

/** Build a minimal entitlements response for testing */
const mockEntitlements = (
  entitlements: Array<{ featureKey: string; value: string | null }>,
): EntitlementsResponse => ({
  billingAccountId: "test",
  entityType: "user",
  entityId: "test",
  entitlementVersion: 1,
  entitlements: entitlements.map((e) => ({
    id: "test",
    productId: "test",
    source: "test",
    validFrom: new Date().toISOString(),
    validUntil: null,
    ...e,
  })),
});

describe("getMaxApiKeys", () => {
  it("returns 3 when entitlements is null", () => {
    expect(getMaxApiKeys(null)).toBe(3);
  });

  it("returns 3 when no max_api_keys entitlement exists", () => {
    expect(getMaxApiKeys(mockEntitlements([]))).toBe(3);
  });

  it("returns null for unlimited (-1)", () => {
    expect(
      getMaxApiKeys(
        mockEntitlements([{ featureKey: "max_api_keys", value: "-1" }]),
      ),
    ).toBeNull();
  });

  it("parses string value", () => {
    expect(
      getMaxApiKeys(
        mockEntitlements([{ featureKey: "max_api_keys", value: "25" }]),
      ),
    ).toBe(25);
  });

  it("handles quoted string value", () => {
    expect(
      getMaxApiKeys(
        mockEntitlements([{ featureKey: "max_api_keys", value: '"25"' }]),
      ),
    ).toBe(25);
  });
});
