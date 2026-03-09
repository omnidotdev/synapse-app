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

  test("sign in button triggers auth flow", async ({ homePage }) => {
    await homePage.goto();
    const signInButton = homePage.getSignInButton();

    await expect(signInButton).toBeEnabled();

    // Click initiates OAuth flow; intercept the auth request so we can
    // verify it fires without depending on an external provider
    const authRequestPromise = homePage.page.waitForRequest(
      (req) => req.url().includes("/api/auth"),
      { timeout: 5000 },
    );

    await signInButton.click();

    // Verify the auth request was initiated
    const authRequest = await authRequestPromise.catch(() => null);
    expect(authRequest).not.toBeNull();
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
      homePage.page
        .locator("header")
        .getByRole("link", { name: "Pricing", exact: true }),
    ).toBeVisible();
  });

  test("unauthenticated visit to /dashboard redirects to pricing signin", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/pricing?signin=true");
  });

  test("unauthenticated visit to /profile redirects to pricing signin", async ({
    page,
  }) => {
    await page.goto("/profile");
    await expect(page).toHaveURL("/pricing?signin=true");
  });
});
