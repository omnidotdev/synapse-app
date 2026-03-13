import capitalizeFirstLetter from "./capitalizeFirstLetter";

import type { EntitlementsResponse } from "@omnidotdev/providers/billing";

/**
 * Extract the plan tier from an entitlements response.
 * @param entitlements - Entitlements response from Aether.
 * @returns Capitalized tier name (e.g. "Free", "Pro") or null if unavailable.
 */
const getTierFromEntitlements = (
  entitlements: EntitlementsResponse | null | undefined,
): string | null => {
  const raw = entitlements?.entitlements?.find(
    (e) => e.featureKey === "tier",
  )?.value;

  if (!raw) return null;

  // Strip JSONB quoting (e.g. `"free"` → `free`)
  const stripped = raw.replace(/^"|"$/g, "");

  return capitalizeFirstLetter(stripped);
};

export default getTierFromEntitlements;
