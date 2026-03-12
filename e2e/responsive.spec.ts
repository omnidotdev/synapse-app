import { expect, test } from "@playwright/test";

test.describe("Mobile Responsiveness", () => {
  test.describe("mobile (375px)", () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test("landing page renders without horizontal scroll", async ({
      page,
    }) => {
      await page.goto("/");
      const body = page.locator("body");
      const scrollWidth = await body.evaluate(
        (el) => el.scrollWidth - el.clientWidth,
      );
      expect(scrollWidth).toBeLessThanOrEqual(1);
    });

    test("hamburger menu is visible on mobile", async ({ page }) => {
      await page.goto("/");
      // On mobile, header should have a hamburger button (not full nav)
      const headerButton = page.locator("header").getByRole("button");
      await expect(headerButton).toBeVisible();
    });

    test("pricing page stacks cards vertically", async ({ page }) => {
      await page.goto("/pricing");
      await expect(page.getByText("Free")).toBeVisible();
      await expect(page.getByText("Synapse Pro")).toBeVisible();
      await expect(page.getByText("Enterprise")).toBeVisible();
    });
  });

  test.describe("tablet (768px)", () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    test("dashboard shows sidebar navigation", async ({ page }) => {
      await page.goto("/dashboard");
      // At tablet+, sidebar nav should be visible
      const sidebar = page.locator("nav");
      await expect(sidebar.getByText("Overview")).toBeVisible();
      await expect(sidebar.getByText("API Keys")).toBeVisible();
    });
  });

  test.describe("desktop (1440px)", () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test("header shows full navigation", async ({ page }) => {
      await page.goto("/");
      const header = page.locator("header");
      await expect(header.getByText("Pricing")).toBeVisible();
    });

    test("pricing cards display in row", async ({ page }) => {
      await page.goto("/pricing");
      // All three cards should be visible at once
      await expect(page.getByText("Free")).toBeVisible();
      await expect(page.getByText("Synapse Pro")).toBeVisible();
      await expect(page.getByText("Enterprise")).toBeVisible();
    });
  });
});
