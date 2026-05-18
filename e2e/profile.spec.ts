import { expect, test } from "@playwright/test";

test.describe("Profile Page", () => {
  test("displays welcome heading", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.getByText(/welcome/i)).toBeVisible();
  });

  test("displays account section", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.getByText("Account")).toBeVisible();
    await expect(page.getByText("Profile")).toBeVisible();
  });

  test("shows user email", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.getByText("Email:")).toBeVisible();
  });

  test("shows member since date", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.getByText("Member since:")).toBeVisible();
  });

  test("displays subscription section", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.getByText("Subscription")).toBeVisible();
  });

  test("has manage account link", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.getByText("Manage Account")).toBeVisible();
  });

  test("has billing dashboard link", async ({ page }) => {
    await page.goto("/profile");
    await expect(
      page.getByRole("link", { name: /billing dashboard/i }),
    ).toBeVisible();
  });
});
