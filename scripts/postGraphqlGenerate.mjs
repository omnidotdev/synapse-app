import { existsSync, readFileSync, writeFileSync } from "node:fs";

// Ensure the `// @ts-nocheck` directive sits on the very first line of each
// generated artifact. graphql-codegen v7 emits internal helper types (Exact,
// Incremental) above any prepended `add` content, and this app's toolchain does
// not invoke the config `beforeOneFileWrite` hook that other omni apps rely on,
// so enforce the directive here deterministically after generation.
const files = [
  "src/generated/graphql.ts",
  "src/generated/graphql.sdk.ts",
  "src/generated/graphql.mock.ts",
];

const directive = "// @ts-nocheck";

for (const file of files) {
  if (!existsSync(file)) continue;
  const body = readFileSync(file, "utf8")
    .split("\n")
    .filter((line) => line.trim() !== directive)
    .join("\n");
  writeFileSync(file, `${directive}\n${body}`);
}
