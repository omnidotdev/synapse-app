/**
 * Pricing configuration for Synapse tiers.
 * Values must match the Omni API catalog SSOT (planConfigs.ts).
 * All prices are in USD cents.
 */
const pricing = {
  free: {
    monthlyPrice: 0,
    yearlyPrice: 0,
  },
  pro: {
    monthlyPrice: 2900,
    yearlyPrice: 27800,
  },
  team: {
    monthlyPrice: 7900,
    yearlyPrice: 75800,
  },
} as const;

export default pricing;
