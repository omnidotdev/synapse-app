import { expect, test } from "@playwright/test";

test.describe("Error Pages", () => {
  test("displays 404 for unknown routes", async ({ page }) => {
    await page.goto("/nonexistent-page");
    await expect(page.getByText("404")).toBeVisible();
    await expect(page.getByText("Page Not Found")).toBeVisible();
  });

  test("404 page has go back button", async ({ page }) => {
    await page.goto("/nonexistent-page");
    await expect(page.getByRole("button", { name: "Go back" })).toBeVisible();
  });

  test("404 page has go home link", async ({ page }) => {
    await page.goto("/nonexistent-page");
    const goHome = page.getByRole("link", { name: "Go Home" });
    await expect(goHome).toBeVisible();
    await expect(goHome).toHaveAttribute("href", "/");
  });

  test("404 page go home navigates to landing", async ({ page }) => {
    await page.goto("/nonexistent-page");
    await page.getByRole("link", { name: "Go Home" }).click();
    await expect(page).toHaveURL("/");
  });
});
