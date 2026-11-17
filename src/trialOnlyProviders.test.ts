import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

// The NVIDIA hosted API allows trial use only, so the managed gateway does not
// route to it; the app must not offer it as a provider anywhere
const TRIAL_ONLY_PROVIDERS = ["nvidia"];

const SRC = import.meta.dir;
const collect = (dir: string): string[] => {
  const out: string[] = [];
  for (const e of readdirSync(dir)) {
    if (e === "node_modules" || e === "generated") continue;
    const full = join(dir, e);
    if (statSync(full).isDirectory()) {
      out.push(...collect(full));
      continue;
    }
    if (!/\.tsx?$/.test(e) || /\.test\.tsx?$/.test(e)) continue;
    out.push(full);
  }
  return out;
};

describe("trial-only providers", () => {
  test("no source file offers a trial-only provider", () => {
    const offenders: string[] = [];
    for (const f of collect(SRC)) {
      const s = readFileSync(f, "utf8");
      for (const provider of TRIAL_ONLY_PROVIDERS) {
        if (new RegExp(`["'\`]${provider}["'\`]`, "i").test(s)) {
          offenders.push(`${f.slice(SRC.length + 1)}: ${provider}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
