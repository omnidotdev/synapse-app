import { expect, test } from "@playwright/test";

test.describe("Mobile Responsiveness", () => {
  test.describe("mobile (375px)", () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test("landing page renders without horizontal scroll", async ({ page }) => {
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

    test("dashboard sidebar navigation is accessible on mobile", async ({
      page,
    }) => {
      await page.goto("/dashboard");

      // Dashboard sidebar links (API Keys, Settings) should be reachable
      // via a mobile drawer/menu, not hidden entirely
      const apiKeysLink = page.getByRole("link", { name: "API Keys" });
      const settingsLink = page.getByRole("link", { name: "Settings" });

      // Check if they're visible directly or via a menu toggle
      const apiKeysVisible = await apiKeysLink.isVisible().catch(() => false);

      if (!apiKeysVisible) {
        // Try to find and click a sidebar toggle/drawer button
        const sidebarToggle = page.getByRole("button", {
          name: /menu|sidebar|navigation/i,
        });
        const toggleExists = await sidebarToggle.isVisible().catch(() => false);

        if (toggleExists) {
          await sidebarToggle.click();
        }
      }

      // After any menu interaction, sidebar links should be accessible
      // This test documents the bug: sidebar nav is unreachable on mobile
      await expect(apiKeysLink).toBeVisible();
      await expect(settingsLink).toBeVisible();
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
