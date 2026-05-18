import { expect, test } from "@playwright/test";

/**
 * End-to-end smoke tests covering the full user journey.
 * These tests run against the live app and validate critical paths.
 */
test.describe("Smoke Tests", () => {
  test("full navigation flow: landing -> pricing -> dashboard", async ({
    page,
  }) => {
    // Landing page
    await page.goto("/");
    await expect(page).toHaveTitle(/Synapse/);
    await expect(page.getByText("The cortex for your AI stack")).toBeVisible();

    // Navigate to pricing
    await page.getByRole("link", { name: "View Pricing" }).first().click();
    await expect(page).toHaveURL(/\/pricing/);
    await expect(page.getByText("Simple, transparent pricing")).toBeVisible();

    // Navigate to dashboard
    await page.getByRole("link", { name: "Get Started" }).first().click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("pricing: monthly/yearly toggle and tier display", async ({ page }) => {
    await page.goto("/pricing");

    // Monthly is default
    const monthlyTab = page.getByRole("tab", { name: /monthly/i });
    const yearlyTab = page.getByRole("tab", { name: /yearly/i });
    await expect(monthlyTab).toHaveAttribute("aria-selected", "true");

    // Verify monthly prices
    await expect(page.getByText("$0")).toBeVisible();
    await expect(page.getByText("$29")).toBeVisible();
    await expect(page.getByText("$79")).toBeVisible();

    // Switch to yearly
    await yearlyTab.click();
    await expect(yearlyTab).toHaveAttribute("aria-selected", "true");
    await expect(page.getByText("$278")).toBeVisible();
    await expect(page.getByText("$758")).toBeVisible();

    // Switch back to monthly
    await monthlyTab.click();
    await expect(page.getByText("/month").first()).toBeVisible();
  });

  test("pricing: all FAQ items are expandable", async ({ page }) => {
    await page.goto("/pricing");

    const faqQuestions = [
      "Can I switch plans later?",
      "What payment methods do you accept?",
      "What happens to my data if I cancel?",
      "Can I self-host this software?",
    ];

    for (const question of faqQuestions) {
      const button = page.getByRole("button", { name: question });
      await expect(button).toBeVisible();
      await button.click();
      await expect(button).toHaveAttribute("aria-expanded", "true");
      // Close it for next iteration
      await button.click();
    }
  });

  test("pricing: free tier feature list matches SSOT", async ({ page }) => {
    await page.goto("/pricing");

    // Verify free tier features match Omni API catalog
    await expect(page.getByText("10,000 requests per month")).toBeVisible();
    await expect(page.getByText("$1 free credits included")).toBeVisible();
    await expect(page.getByText("3 API keys")).toBeVisible();
    await expect(page.getByText("All models supported")).toBeVisible();
    await expect(page.getByText("Usage analytics")).toBeVisible();
    await expect(page.getByText("Bring your own provider keys")).toBeVisible();
  });

  test("pricing: pro tier features", async ({ page }) => {
    await page.goto("/pricing");

    await expect(page.getByText("100,000 requests per month")).toBeVisible();
    await expect(page.getByText("25 API keys")).toBeVisible();
    await expect(
      page.getByText("Smart routing (cost, quality, latency)"),
    ).toBeVisible();
    await expect(
      page.getByText("All modalities (STT, TTS, images, embeddings)"),
    ).toBeVisible();
  });

  test("dashboard: all tabs load without errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    const tabs = [
      "/dashboard",
      "/dashboard/keys",
      "/dashboard/usage",
      "/dashboard/billing",
      "/dashboard/settings",
    ];

    for (const tab of tabs) {
      await page.goto(tab);
      await page.waitForLoadState("networkidle");
    }

    const unexpectedErrors = errors.filter(
      (e) =>
        !e.includes("favicon") &&
        !e.includes("Failed to load resource") &&
        !e.includes("net::ERR") &&
        !e.includes("_nonReactive"),
    );

    expect(unexpectedErrors).toHaveLength(0);
  });

  test("dark mode persists across pages", async ({ page }) => {
    await page.goto("/");

    // Toggle dark mode via desktop button
    const themeButton = page.getByRole("button", {
      name: /switch to dark mode/i,
    });
    const isDarkAlready = (await themeButton.count()) === 0;

    if (!isDarkAlready) {
      await themeButton.click();
    }

    // Navigate to pricing
    await page.goto("/pricing");
    // Should still be in dark mode
    const lightModeButton = page.getByRole("button", {
      name: /switch to light mode/i,
    });
    await expect(lightModeButton).toBeVisible();

    // Navigate to dashboard
    await page.goto("/dashboard");
    await expect(
      page.getByRole("button", { name: /switch to light mode/i }).or(
        // Mobile has theme toggle in menu
        page.locator("[aria-label='Switch to light mode']"),
      ),
    ).toBeVisible();
  });

  test("footer links are present on all public pages", async ({ page }) => {
    const publicPages = ["/", "/pricing"];

    for (const url of publicPages) {
      await page.goto(url);
      const footer = page.locator("footer");
      await expect(footer).toBeVisible();
      await expect(footer.getByText("Omni")).toBeVisible();
      await expect(footer.getByRole("link", { name: "Docs" })).toBeVisible();
    }
  });
});

test.describe("Smoke Tests (Mobile)", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("mobile: landing page renders correctly", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("The cortex for your AI stack")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Get Started" }).first(),
    ).toBeVisible();

    // No horizontal overflow
    const scrollWidth = await page
      .locator("body")
      .evaluate((el) => el.scrollWidth - el.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(1);
  });

  test("mobile: hamburger menu opens and closes", async ({ page }) => {
    await page.goto("/");

    // Open menu
    const openButton = page.getByRole("button", { name: "Open menu" });
    await expect(openButton).toBeVisible();
    await openButton.click();

    // Menu should show navigation links
    const closeButton = page
      .locator("aside")
      .getByRole("button", { name: "Close menu" });
    await expect(closeButton).toBeVisible();
    await expect(
      page.locator("aside").getByRole("link", { name: "Pricing" }),
    ).toBeVisible();

    // Close menu
    await closeButton.click();
    await expect(openButton).toBeVisible();
  });

  test("mobile: pricing page is fully scrollable", async ({ page }) => {
    await page.goto("/pricing");

    // Verify all three tiers are reachable by scrolling
    await expect(page.getByText("Free")).toBeVisible();

    await page.getByText("Team").scrollIntoViewIfNeeded();
    await expect(page.getByText("Team")).toBeVisible();

    // FAQ section should be reachable
    await page.getByText("Frequently Asked Questions").scrollIntoViewIfNeeded();
    await expect(page.getByText("Frequently Asked Questions")).toBeVisible();
  });

  test("mobile: dashboard tab bar is scrollable", async ({ page }) => {
    await page.goto("/dashboard");

    // Core tabs should be visible or scrollable
    await expect(page.getByRole("link", { name: "Overview" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Keys" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Usage" })).toBeVisible();
  });
});
