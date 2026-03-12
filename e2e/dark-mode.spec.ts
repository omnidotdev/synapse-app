import { expect, test } from "@playwright/test";

test.describe("Dark Mode", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Enable dark mode via theme toggle
    const themeToggle = page
      .locator("header")
      .getByRole("button")
      .filter({ hasText: /^$/ })
      .first();
    await themeToggle.click();
  });

  test("homepage feature card headings have sufficient contrast", async ({
    page,
  }) => {
    const headings = ["Scoped Keys", "Multi-Provider", "Intelligent Routing"];

    for (const heading of headings) {
      const el = page.getByRole("heading", { name: heading });
      await expect(el).toBeVisible();

      // Verify the heading text color has sufficient contrast (not near-invisible)
      const color = await el.evaluate((e) => getComputedStyle(e).color);
      // Parse rgb values and ensure they're not too dark (< 80 on all channels)
      const match = color.match(/\d+/g);
      if (match) {
        const [r, g, b] = match.map(Number);
        const luminance = Math.max(r, g, b);
        expect(luminance).toBeGreaterThan(80);
      }
    }
  });

  test("homepage code block JSON keys are visible", async ({ page }) => {
    const codeBlock = page.locator('text=\'"model": "auto"\'');
    await expect(codeBlock).toBeVisible();

    const color = await codeBlock.evaluate((e) => getComputedStyle(e).color);
    const match = color.match(/\d+/g);
    if (match) {
      const [r, g, b] = match.map(Number);
      const luminance = Math.max(r, g, b);
      expect(luminance).toBeGreaterThan(80);
    }
  });

  test("pricing FAQ section text has sufficient contrast", async ({ page }) => {
    await page.goto("/pricing");

    // Re-enable dark mode on pricing page
    const themeToggle = page
      .locator("header")
      .getByRole("button")
      .filter({ hasText: /^$/ })
      .first();
    await themeToggle.click();

    const faqHeading = page.getByRole("heading", {
      name: "Frequently Asked Questions",
    });
    await expect(faqHeading).toBeVisible();

    const color = await faqHeading.evaluate((e) => getComputedStyle(e).color);
    const match = color.match(/\d+/g);
    if (match) {
      const [r, g, b] = match.map(Number);
      const luminance = Math.max(r, g, b);
      expect(luminance).toBeGreaterThan(80);
    }
  });

  test("pricing FAQ accordion items are readable", async ({ page }) => {
    await page.goto("/pricing");

    const themeToggle = page
      .locator("header")
      .getByRole("button")
      .filter({ hasText: /^$/ })
      .first();
    await themeToggle.click();

    const faqButton = page.getByRole("button", {
      name: "Can I switch plans later?",
    });
    await expect(faqButton).toBeVisible();

    const color = await faqButton.evaluate((e) => getComputedStyle(e).color);
    const match = color.match(/\d+/g);
    if (match) {
      const [r, g, b] = match.map(Number);
      const luminance = Math.max(r, g, b);
      expect(luminance).toBeGreaterThan(80);
    }
  });

  test("footer text has sufficient contrast", async ({ page }) => {
    const footer = page.locator("footer");
    const omniLink = footer.getByRole("link", { name: "Omni" });
    await expect(omniLink).toBeVisible();

    const color = await omniLink.evaluate((e) => getComputedStyle(e).color);
    const match = color.match(/\d+/g);
    if (match) {
      const [r, g, b] = match.map(Number);
      const luminance = Math.max(r, g, b);
      expect(luminance).toBeGreaterThan(80);
    }
  });
});
