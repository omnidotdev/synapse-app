import type { KnipConfig } from "knip";

/**
 * Knip configuration.
 * @see https://knip.dev/overview/configuration
 */
const knipConfig: KnipConfig = {
  entry: [
    "src/routes/**/*.{ts,tsx}",
    "src/router.tsx",
    "src/lib/graphql/graphqlFetch.ts",
  ],
  project: ["src/**/*.{ts,tsx,css}"],
  // based on https://knip.dev/reference/plugins/graphql-codegen
  "graphql-codegen": {
    config: ["package.json", "src/lib/graphql/codegen.config.ts"],
  },
  // used for proper management of Thornberry components, see https://knip.dev/reference/configuration#ignoreexportsusedinfile
  ignoreExportsUsedInFile: true,
  ignore: [
    "**/*.gen.*",
    "**/generated/**",
    "src/test/**",
    "src/__tests__/**",
    "**/*.test.{ts,tsx}",
    // reference scaffolding retained for imminent adoption
    "src/lib/config/env.config.ts",
    "src/lib/context/workspace.context.tsx",
    "src/lib/providers/**",
    "src/server/functions/entitlements.ts",
    "src/server/functions/organizations.ts",
  ],
  ignoreDependencies: [
    "@changesets/changelog-github",
    "@changesets/cli",
    "dotenv",
    "@faker-js/faker",
    "@happy-dom/global-registrator",
    "@testing-library/jest-dom",
    "@testing-library/dom",
    "@testing-library/react",
    "happy-dom",
    "tailwindcss",
    "tw-animate-css",
  ],
  tags: ["-knipignore"],
};

export default knipConfig;
