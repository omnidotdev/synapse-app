import { describe, expect, it } from "bun:test";

import { formatFeatureKey, formatFeatureValue } from "./formatEntitlement";

describe("formatFeatureKey", () => {
  it("converts snake_case to title case", () => {
    expect(formatFeatureKey("max_requests_per_month")).toBe(
      "Max Requests Per Month",
    );
  });

  it("handles single word", () => {
    expect(formatFeatureKey("tier")).toBe("Tier");
  });

  it("preserves known acronyms", () => {
    expect(formatFeatureKey("stt_enabled")).toBe("STT Enabled");
    expect(formatFeatureKey("tts_enabled")).toBe("TTS Enabled");
    expect(formatFeatureKey("api_access")).toBe("API Access");
  });
});

describe("formatFeatureValue", () => {
  it("formats -1 as Unlimited", () => {
    expect(formatFeatureValue("models_allowed", "-1")).toBe("Unlimited");
  });

  it("formats boolean 0/1 for _enabled keys", () => {
    expect(formatFeatureValue("stt_enabled", "0")).toBe("No");
    expect(formatFeatureValue("stt_enabled", "1")).toBe("Yes");
    expect(formatFeatureValue("tts_enabled", "0")).toBe("No");
    expect(formatFeatureValue("smart_routing", "1")).toBe("Yes");
  });

  it("formats large numbers with locale separators", () => {
    expect(formatFeatureValue("max_requests_per_month", "1000")).toBe("1,000");
    expect(formatFeatureValue("max_input_tokens_per_month", "400000")).toBe(
      "400,000",
    );
  });

  it("returns tier values as title case", () => {
    expect(formatFeatureValue("tier", "free")).toBe("Free");
    expect(formatFeatureValue("tier", "pro")).toBe("Pro");
  });

  it("passes through non-numeric values", () => {
    expect(formatFeatureValue("custom_field", "hello")).toBe("hello");
  });

  it("handles null and undefined values", () => {
    expect(formatFeatureValue("any_key", null)).toBe("—");
    expect(formatFeatureValue("any_key", undefined)).toBe("—");
  });
});
