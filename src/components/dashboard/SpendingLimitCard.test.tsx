import { describe, expect, it } from "bun:test";

import { parseLimitInput } from "./SpendingLimitCard";

describe("parseLimitInput", () => {
  it("reads whole and fractional dollars as cents", () => {
    expect(parseLimitInput("100")).toBe(10_000);
    expect(parseLimitInput("$250.50")).toBe(25_050);
    expect(parseLimitInput(" 1,000 ")).toBe(100_000);
  });

  it("rejects amounts below the $10 minimum", () => {
    expect(parseLimitInput("9.99")).toBeNull();
    expect(parseLimitInput("0")).toBeNull();
  });

  it("rejects amounts above the maximum", () => {
    expect(parseLimitInput("100001")).toBeNull();
  });

  it("rejects anything that is not a plain dollar amount", () => {
    expect(parseLimitInput("")).toBeNull();
    expect(parseLimitInput("-50")).toBeNull();
    expect(parseLimitInput("12.345")).toBeNull();
    expect(parseLimitInput("1e3")).toBeNull();
    expect(parseLimitInput("ten")).toBeNull();
  });
});
