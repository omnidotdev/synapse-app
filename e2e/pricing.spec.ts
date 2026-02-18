import test, { expect } from "../src/test/e2e/util/test";

test.describe("Pricing Page", () => {
  // Note: Full pricing tests require valid Stripe API keys. The page loader
  // fetches prices from Stripe, which may fail without credentials.
  // To run all tests, configure valid Stripe keys in .env.test.

  test("navigates to pricing page", async ({ pricingPage }) => {
    await pricingPage.goto();
    await expect(pricingPage.page).toHaveURL(/\/pricing/);
  });

  test.skip("displays pricing heading", async ({ pricingPage }) => {
    await pricingPage.goto();
    await expect(pricingPage.getHeading()).toBeVisible();
  });

  test.skip("displays monthly/yearly tabs", async ({ pricingPage }) => {
    await pricingPage.goto();
    await expect(pricingPage.getMonthlyTab()).toBeVisible();
    await expect(pricingPage.getYearlyTab()).toBeVisible();
  });

  test.skip("displays FAQ section", async ({ pricingPage }) => {
    await pricingPage.goto();
    await expect(pricingPage.getFAQSection()).toBeVisible();
  });
});
