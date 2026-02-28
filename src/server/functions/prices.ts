import { createServerFn } from "@tanstack/react-start";

import app from "@/lib/config/app.config";
import getBilling from "@/lib/providers/billing";

import type { Price } from "@omnidotdev/providers";

/**
 * Fetch all prices for this app.
 * Prices are filtered by app name metadata and sorted by unit amount (ascending).
 */
export const getPrices = createServerFn().handler(
  async (): Promise<Price[]> => {
    try {
      return (await getBilling().getPrices(app.name)) ?? [];
    } catch {
      return [];
    }
  },
);
