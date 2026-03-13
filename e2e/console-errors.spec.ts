import { expect, test } from "@playwright/test";

test.describe("Console Errors", () => {
  test("landing page has no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto("/");
    // Allow time for any deferred errors
    await page.waitForTimeout(2000);

    // Filter out expected errors (e.g. favicon 404)
    const unexpectedErrors = errors.filter(
      (e) =>
        !e.includes("favicon") &&
        !e.includes("Failed to load resource") &&
        !e.includes("net::ERR"),
    );
    expect(unexpectedErrors).toHaveLength(0);
  });

  test("pricing page has no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto("/pricing");
    await page.waitForTimeout(2000);

    const unexpectedErrors = errors.filter(
      (e) =>
        !e.includes("favicon") &&
        !e.includes("Failed to load resource") &&
        !e.includes("net::ERR"),
    );
    expect(unexpectedErrors).toHaveLength(0);
  });

  // TODO: this test documents a known TanStack Router preloading bug
  // where `_nonReactive` is undefined during route preloading.
  // Remove `.fixme` once TanStack Router fixes this upstream
  test.fixme("dashboard/keys page has no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto("/dashboard/keys");
    await page.waitForTimeout(2000);

    const unexpectedErrors = errors.filter(
      (e) =>
        !e.includes("favicon") &&
        !e.includes("Failed to load resource") &&
        !e.includes("net::ERR"),
    );
    expect(unexpectedErrors).toHaveLength(0);
  });
});
