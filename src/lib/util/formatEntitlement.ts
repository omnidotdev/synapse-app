const ACRONYMS = new Set(["api", "stt", "tts", "mcp", "sso", "rbac"]);

const BOOLEAN_KEYS = new Set([
  "stt_enabled",
  "tts_enabled",
  "image_gen_enabled",
  "embeddings_enabled",
  "smart_routing",
  "api_access",
  "sso_enabled",
  "team_rbac",
  "byok_enabled",
  "managed_keys_enabled",
  "audit_logs",
]);

/**
 * Convert a snake_case feature key to human-readable title case.
 */
const formatFeatureKey = (key: string) =>
  key
    .split("_")
    .map((word) => (ACRONYMS.has(word) ? word.toUpperCase() : capitalize(word)))
    .join(" ");

/**
 * Format an entitlement value for display.
 */
const formatFeatureValue = (
  key: string,
  value: string | number | null | undefined,
) => {
  if (value == null) return "-";

  const str = String(value);

  if (str === "-1") return "Unlimited";

  if (BOOLEAN_KEYS.has(key)) {
    return str === "1" ? "Yes" : "No";
  }

  if (key === "tier") return capitalize(str);

  const num = Number(str);
  if (!Number.isNaN(num) && str.trim() !== "") {
    return num.toLocaleString("en-US");
  }

  return str;
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export { formatFeatureKey, formatFeatureValue };
