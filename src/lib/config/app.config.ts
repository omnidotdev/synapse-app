/**
 * Application configuration.
 */
const app = {
  name: "Synapse",
  description:
    "An AI router that aggregates MCP servers and LLM providers behind a single endpoint, providing intelligent request routing, tool discovery, and enterprise-grade governance for AI infrastructure.",
  url: "https://synapse.omni.dev",
  docsUrl: "https://docs.omni.dev/grid/synapse",
  socials: {
    discord: "https://discord.gg/omnidotdev",
    x: "https://x.com/omnidotdev",
    threads: "https://www.threads.com/@omnidotdev",
  },
  // Legal links mirror the omni-api catalog SSOT
  legal: {
    privacy: "https://omni.dev/legal/privacy",
    terms: "https://omni.dev/legal/terms",
    cookies: "https://omni.dev/legal/cookies",
  },
  organization: {
    name: "Omni",
    supportEmailAddress: "support@omni.dev",
  },
  /** PWA configuration. Values should match public/manifest.json. */
  pwa: {
    themeColor: "#000000",
    backgroundColor: "#000000",
  },
};

export default app;
