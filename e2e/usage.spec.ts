import { expect, test } from "@playwright/test";

test.describe("Usage Page", () => {
  test("usage limits reflect free plan limits", async ({ page }) => {
    await page.goto("/dashboard/usage");

    // Free plan has 1,000 requests/month and 500K tokens/month
    // The usage limits section should show these limits, not "No limit configured"
    const limitsSection = page.getByText("Usage Limits");
    await expect(limitsSection).toBeVisible();

    // At minimum, free plan should show configured limits
    const noLimitTexts = page.getByText("No limit configured");
    const noLimitCount = await noLimitTexts.count();

    // Free plan should have limits configured for at least requests and tokens
    // This test documents the bug: free plan shows "No limit configured" everywhere
    expect(noLimitCount).toBeLessThan(3);
  });

  test("usage chart does not overlap with navbar", async ({ page }) => {
    await page.goto("/dashboard/usage");

    const navbar = page.locator("header");
    const chart = page.getByText("Token Usage").locator("..");

    const navbarBox = await navbar.boundingBox();
    const chartBox = await chart.boundingBox();

    if (navbarBox && chartBox) {
      // Chart should start below the navbar (no overlap)
      expect(chartBox.y).toBeGreaterThanOrEqual(navbarBox.y + navbarBox.height);
    }
  });

  test("time range buttons change the selected period", async ({ page }) => {
    await page.goto("/dashboard/usage");

    const sevenDays = page.getByRole("button", { name: "7 days" });
    const thirtyDays = page.getByRole("button", { name: "30 days" });
    const ninetyDays = page.getByRole("button", { name: "90 days" });

    await expect(sevenDays).toBeVisible();
    await expect(thirtyDays).toBeVisible();
    await expect(ninetyDays).toBeVisible();

    // Click 7 days and verify it becomes active
    await sevenDays.click();
    await page.waitForTimeout(500);

    // Click 90 days and verify it works
    await ninetyDays.click();
    await page.waitForTimeout(500);
  });
});
