import { authenticatedTest, expect } from "../src/test/e2e/util";

authenticatedTest.describe("Profile", () => {
  authenticatedTest(
    "loads with welcome heading",
    async ({ profilePage }) => {
      await profilePage.goto();
      await expect(profilePage.getWelcomeHeading()).toBeVisible();
    },
  );

  authenticatedTest(
    "shows subscription section",
    async ({ profilePage }) => {
      await profilePage.goto();
      await expect(profilePage.getSubscriptionSection()).toBeVisible();
    },
  );

  authenticatedTest(
    "has billing dashboard link",
    async ({ profilePage }) => {
      await profilePage.goto();
      await expect(profilePage.getBillingLink()).toBeVisible();
    },
  );
});
