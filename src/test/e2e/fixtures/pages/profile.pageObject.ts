import { createPageObject } from "@/test/e2e/util";

import type { PageObjectContext } from "@/test/e2e/util";

/**
 * Profile page object.
 */
const createProfilePageObject = ({ page, context }: PageObjectContext) =>
  createPageObject({
    page,
    context,
    name: "Profile",
    baseUrl: "/profile",
    getWelcomeHeading: () => page.getByRole("heading", { name: /welcome/i }),
    getSubscriptionSection: () =>
      page.getByRole("heading", { name: "Subscription" }),
    getBillingLink: () =>
      page.getByRole("link", { name: "Go to Billing Dashboard" }),
  });

export type ProfilePageObject = ReturnType<typeof createProfilePageObject>;

export default createProfilePageObject;
