import { describe, expect, it } from "bun:test";

import getAnalyticsRetentionDays from "./getAnalyticsRetentionDays";

describe("getAnalyticsRetentionDays", () => {
  it("returns 7 when entitlements is null", () => {
    expect(getAnalyticsRetentionDays(null)).toBe(7);
  });

  it("returns 7 when entitlements is undefined", () => {
    expect(getAnalyticsRetentionDays(undefined)).toBe(7);
  });

  it("returns 7 when no analytics_retention_days entitlement exists", () => {
    expect(getAnalyticsRetentionDays({ entitlements: [] })).toBe(7);
  });

  it("returns 365 for unlimited (-1)", () => {
    expect(
      getAnalyticsRetentionDays({
        entitlements: [
          { featureKey: "analytics_retention_days", value: "-1" },
        ],
      }),
    ).toBe(365);
  });

  it("parses string value", () => {
    expect(
      getAnalyticsRetentionDays({
        entitlements: [
          { featureKey: "analytics_retention_days", value: "90" },
        ],
      }),
    ).toBe(90);
  });

  it("handles numeric value (non-string)", () => {
    expect(
      getAnalyticsRetentionDays({
        entitlements: [{ featureKey: "analytics_retention_days", value: 7 }],
      }),
    ).toBe(7);
  });

  it("handles numeric unlimited (-1 as number)", () => {
    expect(
      getAnalyticsRetentionDays({
        entitlements: [{ featureKey: "analytics_retention_days", value: -1 }],
      }),
    ).toBe(365);
  });

  it("handles quoted string value", () => {
    expect(
      getAnalyticsRetentionDays({
        entitlements: [
          { featureKey: "analytics_retention_days", value: '"90"' },
        ],
      }),
    ).toBe(90);
  });
});
