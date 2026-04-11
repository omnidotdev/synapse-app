import { expect, test } from "@playwright/test";

test.describe("Service Worker", () => {
  test("sw.js returns 200", async ({ page }) => {
    const response = await page.goto("/sw.js");
    expect(response).not.toBeNull();
    expect(response?.status()).toBe(200);
  });

  test("sw.js has correct content type", async ({ page }) => {
    const response = await page.goto("/sw.js");
    expect(response).not.toBeNull();
    const contentType = response?.headers()["content-type"] ?? "";
    expect(contentType).toContain("javascript");
  });
});
