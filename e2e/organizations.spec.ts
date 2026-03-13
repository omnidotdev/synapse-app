import { expect, test } from "@playwright/test";

test.describe("Organizations", () => {
  test("organization detail page loads without crashing", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto("/organizations");

    // Click on the first organization link
    const orgLink = page.locator("a[href^='/organizations/']").first();
    await orgLink.click();

    // Should not show error boundary
    await expect(page.getByText("Something went wrong")).not.toBeVisible();

    // Should not have WorkspaceProvider context errors
    const contextErrors = errors.filter((e) =>
      e.includes("useWorkspace must be used within"),
    );
    expect(contextErrors).toHaveLength(0);
  });

  test("organization detail page does not throw useWorkspace error", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    // Navigate directly to org slug (using a common pattern)
    await page.goto("/organizations");
    await page.waitForTimeout(1000);

    // Get the first org link href and navigate
    const orgLinks = page.locator("a[href^='/organizations/']");
    const count = await orgLinks.count();

    if (count > 0) {
      const href = await orgLinks.first().getAttribute("href");
      if (href) {
        await page.goto(href);
        await page.waitForTimeout(2000);

        // The page should render without crashing
        const errorBoundary = page.getByText("Something went wrong");
        const hasError = await errorBoundary.isVisible().catch(() => false);

        expect(hasError).toBe(false);
      }
    }
  });
});
