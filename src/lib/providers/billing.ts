import { createBillingProvider } from "@omnidotdev/providers";

import {
  BILLING_BASE_URL,
  BILLING_SERVICE_API_KEY,
} from "@/lib/config/env.config";

import type { BillingProvider } from "@omnidotdev/providers";

let instance: BillingProvider | undefined;

/** Lazily instantiate the billing provider on first use */
const getBilling = (): BillingProvider => {
  if (!instance) {
    instance = createBillingProvider({
      provider: "aether",
      baseUrl: BILLING_BASE_URL,
      appId: "synapse",
      serviceApiKey: BILLING_SERVICE_API_KEY,
    });
  }

  return instance;
};

export default getBilling;
