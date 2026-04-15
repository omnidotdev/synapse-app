import { describe, expect, test } from "bun:test";

import pricing from "./pricing.config";

/**
 * Validate pricing config matches Omni API catalog SSOT.
 * SSOT source: api-stack/services/api/src/lib/db/catalog/planConfigs.ts
 */
describe("pricing config", () => {
  test("free tier prices match SSOT", () => {
    expect(pricing.free.monthlyPrice).toBe(0);
    expect(pricing.free.yearlyPrice).toBe(0);
  });

  test("pro tier prices match SSOT", () => {
    expect(pricing.pro.monthlyPrice).toBe(2900);
    expect(pricing.pro.yearlyPrice).toBe(27800);
    expect(pricing.pro.overageRatePer1k).toBe(50);
  });

  test("team tier prices match SSOT", () => {
    expect(pricing.team.monthlyPrice).toBe(7900);
    expect(pricing.team.yearlyPrice).toBe(75800);
  });

  test("overage rates match SSOT", () => {
    expect(pricing.free.overageRatePer1k).toBe(0);
    expect(pricing.pro.overageRatePer1k).toBe(50);
    expect(pricing.team.overageRatePer1k).toBe(0);
  });

  test("yearly prices are less than 12x monthly", () => {
    for (const [, config] of Object.entries(pricing)) {
      if (config.monthlyPrice === 0) continue;

      const annualizedMonthly = config.monthlyPrice * 12;

      expect(config.yearlyPrice).toBeLessThan(annualizedMonthly);
    }
  });

  test("all prices are non-negative integers", () => {
    for (const config of Object.values(pricing)) {
      expect(Number.isInteger(config.monthlyPrice)).toBe(true);
      expect(Number.isInteger(config.yearlyPrice)).toBe(true);
      expect(config.monthlyPrice).toBeGreaterThanOrEqual(0);
      expect(config.yearlyPrice).toBeGreaterThanOrEqual(0);
    }
  });
});
