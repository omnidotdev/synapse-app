import type { KnipConfig } from "knip";

/**
 * Knip configuration.
 * @see https://knip.dev/overview/configuration
 *
 * NOTE: Many lib files are intentionally unused in the template.
 * They serve as reference patterns for Omni products to adopt.
 */
const knipConfig: KnipConfig = {
  entry: [
    "src/routes/**/*.{ts,tsx}",
    "src/router.tsx",
    "src/lib/graphql/graphqlFetch.ts",
    "src/sw.ts",
  ],
  project: ["src/**/*.{ts,tsx,css}"],
  // based on https://knip.dev/reference/plugins/graphql-codegen
  "graphql-codegen": {
    config: ["package.json", "src/lib/graphql/codegen.config.ts"],
  },
  // used for proper management of Thornberry components, see https://knip.dev/reference/configuration#ignoreexportsusedinfile
  ignoreExportsUsedInFile: true,
  ignore: [
    "**/generated/**",
    "src/test/**",
    // Reference patterns - unused in template but available for adoption
    "src/lib/config/env.config.ts",
    "src/lib/context/workspace.context.tsx",
    "src/server/functions/entitlements.ts",
    "src/server/functions/providerKeys.ts",
  ],
  ignoreDependencies: [
    "dotenv",
    "@faker-js/faker",
    "@testing-library/jest-dom",
    "happy-dom",
  ],
  tags: ["-knipignore"],
};

export default knipConfig;
