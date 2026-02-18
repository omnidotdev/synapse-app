import test, { expect } from "../src/test/e2e/util/test";

test.describe("Authentication", () => {
  test("sign in button is visible on home page", async ({ homePage }) => {
    await homePage.goto();
    await expect(homePage.getSignInButton()).toBeVisible();
  });

  test("sign in button is enabled and clickable", async ({ homePage }) => {
    await homePage.goto();
    const signInButton = homePage.getSignInButton();

    await expect(signInButton).toBeEnabled();
  });

  test("sign in button triggers auth redirect", async ({ homePage }) => {
    await homePage.goto();
    const signInButton = homePage.getSignInButton();

    // Capture the current URL before clicking
    const urlBefore = homePage.page.url();

    // Clicking initiates OAuth flow which redirects away from the app
    await signInButton.click();

    // The OAuth redirect should change the URL or show a loading state
    await homePage.page
      .waitForURL((url) => url.toString() !== urlBefore, {
        timeout: 5000,
      })
      .catch(() => {
        // If no redirect happens (auth provider unreachable), the button
        // should at least show a pending/disabled state
      });

    // After click, either we redirected or the button entered pending state
    const currentUrl = homePage.page.url();
    const buttonDisabled = await signInButton.isDisabled().catch(() => false);
    const urlChanged = currentUrl !== urlBefore;

    // At minimum one of these should be true: redirect happened or button
    // entered loading state
    expect(urlChanged || buttonDisabled).toBeTruthy();
  });

  test("dashboard link is not visible when unauthenticated", async ({
    homePage,
  }) => {
    await homePage.goto();
    await expect(
      homePage.page.getByRole("link", { name: "Dashboard" }),
    ).not.toBeVisible();
  });

  test("pricing link is always visible in header", async ({ homePage }) => {
    await homePage.goto();
    await expect(
      homePage.page.getByRole("link", { name: "Pricing" }),
    ).toBeVisible();
  });

  test("unauthenticated visit to /dashboard redirects to home", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/");
  });

  test("unauthenticated visit to /profile redirects to home", async ({
    page,
  }) => {
    await page.goto("/profile");
    await expect(page).toHaveURL("/");
  });
});
