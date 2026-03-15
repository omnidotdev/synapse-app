import type { EntitlementsResponse } from "@omnidotdev/providers";

/**
 * Extract max_api_keys limit from entitlements.
 * Returns null for unlimited, a number for capped, defaults to 1 (free tier).
 */
const getMaxApiKeys = (
  entitlements: EntitlementsResponse | null,
): number | null => {
  if (!entitlements) return 1;

  const entry = entitlements.entitlements?.find(
    (e) => e.featureKey === "max_api_keys",
  );

  if (!entry?.value) return 1;

  const val = Number.parseInt(entry.value.replace(/"/g, ""), 10);

  return val === -1 ? null : val;
};

export default getMaxApiKeys;
