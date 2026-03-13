import type { EntitlementsResponse } from "@omnidotdev/providers/billing";

/** Default retention for free tier */
const FREE_TIER_RETENTION = 7;

/**
 * Extract analytics_retention_days from entitlements.
 * Defaults to 7 (free tier) when unavailable.
 */
const getAnalyticsRetentionDays = (
  entitlements: EntitlementsResponse | null | undefined,
): number => {
  if (!entitlements) return FREE_TIER_RETENTION;

  const entry = entitlements.entitlements?.find(
    (e) => e.featureKey === "analytics_retention_days",
  );

  if (!entry?.value) return FREE_TIER_RETENTION;

  const val = Number.parseInt(entry.value.replace(/"/g, ""), 10);

  // -1 means unlimited; treat as 365 for UI purposes
  return val === -1 ? 365 : val || FREE_TIER_RETENTION;
};

export default getAnalyticsRetentionDays;
