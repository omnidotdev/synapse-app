import test, { expect } from "../src/test/e2e/util/test";

test.describe("Pricing Page", () => {
  test("navigates to pricing page", async ({ pricingPage }) => {
    await pricingPage.goto();
    await expect(pricingPage.page).toHaveURL(/\/pricing/);
  });

  test("displays pricing heading", async ({ pricingPage }) => {
    await pricingPage.goto();
    await expect(pricingPage.getHeading()).toBeVisible();
  });

  test("displays monthly/yearly tabs", async ({ pricingPage }) => {
    await pricingPage.goto();
    await expect(pricingPage.getMonthlyTab()).toBeVisible();
    await expect(pricingPage.getYearlyTab()).toBeVisible();
  });

  test("monthly tab is selected by default", async ({ pricingPage }) => {
    await pricingPage.goto();
    await expect(pricingPage.getMonthlyTab()).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  test("yearly tab switches pricing", async ({ pricingPage }) => {
    await pricingPage.goto();
    await pricingPage.getYearlyTab().click();
    await expect(pricingPage.getYearlyTab()).toHaveAttribute(
      "aria-selected",
      "true",
    );
    // Yearly price should be visible
    await expect(pricingPage.page.getByText("/year")).toBeVisible();
  });

  test("displays FAQ section", async ({ pricingPage }) => {
    await pricingPage.goto();
    await expect(pricingPage.getFAQSection()).toBeVisible();
  });

  test("FAQ accordion expands on click", async ({ pricingPage }) => {
    await pricingPage.goto();
    const faqButton = pricingPage.page.getByRole("button", {
      name: "Can I switch plans later?",
    });
    await faqButton.click();
    await expect(faqButton).toHaveAttribute("aria-expanded", "true");
  });

  test("displays three pricing tiers", async ({ pricingPage }) => {
    await pricingPage.goto();
    await expect(pricingPage.page.getByText("Free")).toBeVisible();
    await expect(pricingPage.page.getByText("Synapse Pro")).toBeVisible();
    await expect(pricingPage.page.getByText("Enterprise")).toBeVisible();
  });

  test("free tier shows $0/forever", async ({ pricingPage }) => {
    await pricingPage.goto();
    await expect(pricingPage.page.getByText("$0")).toBeVisible();
    await expect(pricingPage.page.getByText("/forever")).toBeVisible();
  });

  test("pro tier shows $39/month", async ({ pricingPage }) => {
    await pricingPage.goto();
    await expect(pricingPage.page.getByText("$39")).toBeVisible();
  });
});
