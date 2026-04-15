/**
 * Pricing configuration for Synapse tiers.
 * Values must match the Omni API catalog SSOT (planConfigs.ts).
 * All prices are in USD cents.
 * Overage rate is in USD cents per 1,000 requests (0 = hard limit).
 */
const pricing = {
  free: {
    monthlyPrice: 0,
    yearlyPrice: 0,
    overageRatePer1k: 0,
  },
  pro: {
    monthlyPrice: 2900,
    yearlyPrice: 27800,
    overageRatePer1k: 50,
  },
  team: {
    monthlyPrice: 7900,
    yearlyPrice: 75800,
    overageRatePer1k: 0,
  },
} as const;

export default pricing;
