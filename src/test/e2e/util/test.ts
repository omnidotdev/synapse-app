import { test as testBase } from "@playwright/test";

import { TEST_AUTH_COOKIE } from "@/test/e2e/fixtures/auth";
import {
  createDashboardPageObject,
  createHomePageObject,
  createPricingPageObject,
  createProfilePageObject,
} from "@/test/e2e/fixtures/pages";

import type {
  DashboardPageObject,
  HomePageObject,
  PricingPageObject,
  ProfilePageObject,
} from "@/test/e2e/fixtures/pages";

interface PageObjects {
  homePage: HomePageObject;
  pricingPage: PricingPageObject;
}

interface AuthenticatedPageObjects extends PageObjects {
  dashboardPage: DashboardPageObject;
  profilePage: ProfilePageObject;
}

/**
 * Augmented version of Playwright's `test` function that provides
 * [page objects](https://martinfowler.com/bliki/PageObject.html) as fixtures.
 *
 * @see https://playwright.dev/docs/test-fixtures
 */
const test = testBase.extend<PageObjects>({
  homePage: async ({ page, context }, use) =>
    use(createHomePageObject({ page, context })),
  pricingPage: async ({ page, context }, use) =>
    use(createPricingPageObject({ page, context })),
});

/**
 * Test fixture that injects the E2E auth bypass cookie before each test,
 * simulating an authenticated session without an external auth provider.
 *
 * @see https://playwright.dev/docs/test-fixtures
 */
export const authenticatedTest = testBase.extend<AuthenticatedPageObjects>({
  context: async ({ context }, use) => {
    await context.addCookies([
      {
        name: TEST_AUTH_COOKIE,
        value: "true",
        domain: "localhost",
        path: "/",
      },
    ]);
    await use(context);
  },
  homePage: async ({ page, context }, use) =>
    use(createHomePageObject({ page, context })),
  pricingPage: async ({ page, context }, use) =>
    use(createPricingPageObject({ page, context })),
  dashboardPage: async ({ page, context }, use) =>
    use(createDashboardPageObject({ page, context })),
  profilePage: async ({ page, context }, use) =>
    use(createProfilePageObject({ page, context })),
});

export { expect } from "@playwright/test";
export default test;
