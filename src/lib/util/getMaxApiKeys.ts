import type { EntitlementsResponse } from "@omnidotdev/providers/billing";

/**
 * Extract max_api_keys limit from entitlements.
 * Returns null for unlimited, a number for capped, defaults to 3 (free tier).
 */
const getMaxApiKeys = (
  entitlements: EntitlementsResponse | null,
): number | null => {
  if (!entitlements) return 3;

  const entry = entitlements.entitlements?.find(
    (e) => e.featureKey === "max_api_keys",
  );

  if (!entry?.value) return 3;

  const val = Number.parseInt(String(entry.value).replace(/"/g, ""), 10);

  return val === -1 ? null : val;
};

export default getMaxApiKeys;
