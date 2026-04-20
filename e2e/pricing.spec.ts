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

  test("FAQ section is not clipped by viewport", async ({ pricingPage }) => {
    await pricingPage.goto();

    const faqHeading = pricingPage.getFAQSection();
    await expect(faqHeading).toBeVisible();

    // Verify the FAQ section is scrollable and within the document flow
    const isInViewport = await faqHeading.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const docHeight = document.documentElement.scrollHeight;

      // The element should be within the scrollable document
      return rect.top < docHeight && rect.height > 0;
    });

    expect(isInViewport).toBe(true);
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
    await expect(pricingPage.page.getByText("Pro")).toBeVisible();
    await expect(pricingPage.page.getByText("Team")).toBeVisible();
  });

  test("free tier shows $0/forever", async ({ pricingPage }) => {
    await pricingPage.goto();
    await expect(pricingPage.page.getByText("$0")).toBeVisible();
    await expect(pricingPage.page.getByText("/forever")).toBeVisible();
  });

  test("pro tier shows $29/month", async ({ pricingPage }) => {
    await pricingPage.goto();
    await expect(pricingPage.page.getByText("$29")).toBeVisible();
    await expect(pricingPage.page.getByText("/month").first()).toBeVisible();
  });

  test("team tier shows $79/month", async ({ pricingPage }) => {
    await pricingPage.goto();
    await expect(pricingPage.page.getByText("$79")).toBeVisible();
  });

  test("page content extends beyond viewport when needed", async ({
    pricingPage,
  }) => {
    await pricingPage.goto();

    // Verify the page is scrollable (content exceeds viewport)
    const scrollInfo = await pricingPage.page.evaluate(() => ({
      scrollHeight: document.documentElement.scrollHeight,
      viewportHeight: window.innerHeight,
    }));

    expect(scrollInfo.scrollHeight).toBeGreaterThan(scrollInfo.viewportHeight);
  });
});
