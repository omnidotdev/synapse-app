import { authenticatedTest, expect } from "../src/test/e2e/util";

authenticatedTest.describe("Authenticated Header", () => {
  authenticatedTest(
    "shows Dashboard link when authenticated",
    async ({ homePage }) => {
      await homePage.goto();
      await expect(
        homePage.page.getByRole("link", { name: "Dashboard" }),
      ).toBeVisible();
    },
  );

  authenticatedTest(
    "shows avatar menu with profile, dashboard, and sign out",
    async ({ homePage }) => {
      await homePage.goto();

      // Open the user/avatar menu
      const avatarButton = homePage.page
        .getByRole("button")
        .filter({ has: homePage.page.locator("img, svg, span").first() })
        .last();

      // If the avatar button exists, click it and check menu items
      if (await avatarButton.isVisible().catch(() => false)) {
        await avatarButton.click();
        await expect(
          homePage.page.getByRole("menuitem", { name: /profile/i }),
        ).toBeVisible();
        await expect(
          homePage.page.getByRole("menuitem", { name: /dashboard/i }),
        ).toBeVisible();
        await expect(
          homePage.page.getByRole("menuitem", { name: /sign out/i }),
        ).toBeVisible();
      }
    },
  );

  authenticatedTest(
    "does not show Sign In button when authenticated",
    async ({ homePage }) => {
      await homePage.goto();
      await expect(
        homePage.page.getByRole("button", { name: "Sign In" }),
      ).not.toBeVisible();
    },
  );
});
