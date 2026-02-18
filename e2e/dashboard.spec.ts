import { authenticatedTest, expect } from "../src/test/e2e/util";

authenticatedTest.describe("Dashboard", () => {
  authenticatedTest(
    "loads without redirect when authenticated",
    async ({ dashboardPage }) => {
      await dashboardPage.goto();
      await expect(dashboardPage.page).toHaveURL(/\/dashboard/);
    },
  );

  authenticatedTest(
    "renders sidebar navigation",
    async ({ dashboardPage }) => {
      await dashboardPage.goto();
      await expect(dashboardPage.getSidebar()).toBeVisible();
    },
  );

  authenticatedTest(
    "sidebar contains all nav links",
    async ({ dashboardPage }) => {
      await dashboardPage.goto();
      await expect(dashboardPage.getUsageLink()).toBeVisible();
      await expect(dashboardPage.getBillingLink()).toBeVisible();
      await expect(dashboardPage.getKeysLink()).toBeVisible();
      await expect(dashboardPage.getSettingsLink()).toBeVisible();
    },
  );

  authenticatedTest(
    "navigates to usage page",
    async ({ dashboardPage }) => {
      await dashboardPage.goto();
      await dashboardPage.getUsageLink().click();
      await expect(dashboardPage.page).toHaveURL(/\/dashboard\/usage/);
    },
  );

  authenticatedTest(
    "navigates to API keys page",
    async ({ dashboardPage }) => {
      await dashboardPage.goto();
      await dashboardPage.getKeysLink().click();
      await expect(dashboardPage.page).toHaveURL(/\/dashboard\/keys/);
    },
  );

  authenticatedTest(
    "navigates to billing page",
    async ({ dashboardPage }) => {
      await dashboardPage.goto();
      await dashboardPage.getBillingLink().click();
      await expect(dashboardPage.page).toHaveURL(/\/dashboard\/billing/);
    },
  );

  authenticatedTest(
    "navigates to settings page",
    async ({ dashboardPage }) => {
      await dashboardPage.goto();
      await dashboardPage.getSettingsLink().click();
      await expect(dashboardPage.page).toHaveURL(/\/dashboard\/settings/);
    },
  );
});
