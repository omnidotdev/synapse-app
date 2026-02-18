import test, { expect } from "../src/test/e2e/util/test";

test.describe("Navigation", () => {
  test("header navigation links are present", async ({ homePage }) => {
    await homePage.goto();
    await expect(homePage.getPricingLink()).toBeVisible();
    await expect(homePage.getSignInButton()).toBeVisible();
  });

  test("logo links to home page", async ({ homePage }) => {
    await homePage.goto();
    const logoLink = homePage.page
      .locator("header")
      .getByRole("link")
      .first();
    await expect(logoLink).toHaveAttribute("href", "/");
  });

  test("pricing link navigates to pricing page", async ({ homePage }) => {
    await homePage.goto();
    await homePage.getPricingLink().click();
    await expect(homePage.page).toHaveURL(/\/pricing/);
  });

  test("can navigate back to home from pricing", async ({
    homePage,
    pricingPage,
  }) => {
    await pricingPage.goto();
    // Click the logo/app name to go home
    const logoLink = pricingPage.page
      .locator("header")
      .getByRole("link")
      .first();
    await logoLink.click();
    await expect(homePage.page).toHaveURL("/");
  });

  test("theme toggle is present", async ({ homePage }) => {
    await homePage.goto();
    await expect(homePage.getThemeToggle()).toBeVisible();
  });

  test("theme toggle changes theme", async ({ homePage }) => {
    await homePage.goto();

    // Get initial theme from html element
    const htmlElement = homePage.page.locator("html");
    const initialClass = await htmlElement.getAttribute("class");

    // Click theme toggle
    await homePage.getThemeToggle().click();

    // Theme class should change
    const newClass = await htmlElement.getAttribute("class");
    expect(newClass).not.toBe(initialClass);
  });

  test("footer contains docs link", async ({ homePage }) => {
    await homePage.goto();
    const docsLink = homePage.page.locator("footer").getByText("Docs");
    await expect(docsLink).toBeVisible();
  });

  test("footer contains social links", async ({ homePage }) => {
    await homePage.goto();
    const footer = homePage.page.locator("footer");
    // Discord and X social links should be present
    const socialLinks = footer.getByRole("link");
    await expect(socialLinks).not.toHaveCount(0);
  });
});
