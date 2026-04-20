import { describe, expect, it } from "bun:test";

import getAnalyticsRetentionDays from "./getAnalyticsRetentionDays";

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

describe("getAnalyticsRetentionDays", () => {
  it("returns 7 when entitlements is null", () => {
    expect(getAnalyticsRetentionDays(null)).toBe(7);
  });

  it("returns 7 when entitlements is undefined", () => {
    expect(getAnalyticsRetentionDays(undefined)).toBe(7);
  });

  it("returns 7 when no analytics_retention_days entitlement exists", () => {
    expect(getAnalyticsRetentionDays(mockEntitlements([]))).toBe(7);
  });

  it("returns 365 for unlimited (-1)", () => {
    expect(
      getAnalyticsRetentionDays(
        mockEntitlements([
          { featureKey: "analytics_retention_days", value: "-1" },
        ]),
      ),
    ).toBe(365);
  });

  it("parses string value", () => {
    expect(
      getAnalyticsRetentionDays(
        mockEntitlements([
          { featureKey: "analytics_retention_days", value: "90" },
        ]),
      ),
    ).toBe(90);
  });

  it("handles quoted string value", () => {
    expect(
      getAnalyticsRetentionDays(
        mockEntitlements([
          { featureKey: "analytics_retention_days", value: '"90"' },
        ]),
      ),
    ).toBe(90);
  });
});
