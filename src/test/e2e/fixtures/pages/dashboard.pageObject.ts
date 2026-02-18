import { createPageObject } from "@/test/e2e/util";

import type { PageObjectContext } from "@/test/e2e/util";

/**
 * Dashboard page object.
 */
const createDashboardPageObject = ({ page, context }: PageObjectContext) =>
  createPageObject({
    page,
    context,
    name: "Dashboard",
    baseUrl: "/dashboard",
    getSidebar: () =>
      page.locator("nav").filter({ has: page.getByText("Overview") }),
    getOverviewHeading: () => page.getByRole("heading", { name: "Dashboard" }),
    getUsageLink: () => page.getByRole("link", { name: "Usage" }),
    getBillingLink: () => page.getByRole("link", { name: "Billing" }),
    getKeysLink: () => page.getByRole("link", { name: "API Keys" }),
    getSettingsLink: () => page.getByRole("link", { name: "Settings" }),
  });

export type DashboardPageObject = ReturnType<typeof createDashboardPageObject>;

export default createDashboardPageObject;
