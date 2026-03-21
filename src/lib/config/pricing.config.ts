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
    monthlyPrice: 1500,
    yearlyPrice: 14400,
  },
  team: {
    monthlyPrice: 3900,
    yearlyPrice: 38400,
  },
} as const;

export default pricing;
