import test, { expect } from "../src/test/e2e/util/test";

test.describe("Home Page", () => {
  test("loads successfully", async ({ homePage }) => {
    await homePage.goto();
    await expect(homePage.page).toHaveTitle(/Synapse/);
  });

  test("renders header with app name", async ({ homePage }) => {
    await homePage.goto();
    await expect(homePage.getHeader()).toBeVisible();
    await expect(
      homePage.page.getByRole("heading", { name: "Synapse", level: 1 }),
    ).toBeVisible();
  });

  test("renders hero section", async ({ homePage }) => {
    await homePage.goto();
    // Hero heading
    await expect(
      homePage.page.getByRole("heading", { name: "Synapse" }).first(),
    ).toBeVisible();
    // Tagline
    await expect(
      homePage.page.getByText("The cortex for your AI stack"),
    ).toBeVisible();
  });

  test("renders feature cards", async ({ homePage }) => {
    await homePage.goto();
    await expect(
      homePage.page.getByRole("heading", { name: "Intelligent Routing" }),
    ).toBeVisible();
    await expect(
      homePage.page.getByRole("heading", { name: "Live Analytics" }),
    ).toBeVisible();
    await expect(
      homePage.page.getByRole("heading", { name: "Scoped Keys" }),
    ).toBeVisible();
  });

  test("renders feature leaf nodes", async ({ homePage }) => {
    await homePage.goto();
    await expect(
      homePage.page.getByRole("heading", { name: "Auto Routing" }),
    ).toBeVisible();
    await expect(
      homePage.page.getByRole("heading", { name: "Live Analytics" }),
    ).toBeVisible();
    await expect(
      homePage.page.getByRole("heading", { name: "Scoped Keys" }),
    ).toBeVisible();
  });

  test("renders CTA buttons", async ({ homePage }) => {
    await homePage.goto();
    await expect(
      homePage.page.getByRole("link", { name: "Get Started" }).first(),
    ).toBeVisible();
    await expect(
      homePage.page.getByRole("link", { name: "View Pricing" }).first(),
    ).toBeVisible();
  });

  test("navigates to pricing via CTA", async ({ homePage }) => {
    await homePage.goto();
    await homePage.getPricingLink().click();
    await expect(homePage.page).toHaveURL(/\/pricing/);
  });

  test("renders footer", async ({ homePage }) => {
    await homePage.goto();
    await expect(homePage.page.locator("footer")).toBeVisible();
    await expect(homePage.page.getByText("Omni")).toBeVisible();
  });

  test("shows sign in button when unauthenticated", async ({ homePage }) => {
    await homePage.goto();
    await expect(homePage.getSignInButton()).toBeVisible();
  });
});
