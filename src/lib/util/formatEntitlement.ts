const ACRONYMS = new Set(["api", "stt", "tts", "mcp"]);

const BOOLEAN_KEYS = new Set([
  "stt_enabled",
  "tts_enabled",
  "image_gen_enabled",
  "embeddings_enabled",
  "smart_routing",
  "api_access",
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
const formatFeatureValue = (key: string, value: string | null | undefined) => {
  if (value == null) return "—";

  if (value === "-1") return "Unlimited";

  if (BOOLEAN_KEYS.has(key)) {
    return value === "1" ? "Yes" : "No";
  }

  if (key === "tier") return capitalize(value);

  const num = Number(value);
  if (!Number.isNaN(num) && value.trim() !== "") {
    return num.toLocaleString("en-US");
  }

  return value;
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export { formatFeatureKey, formatFeatureValue };
