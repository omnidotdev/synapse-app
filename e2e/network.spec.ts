import { expect, test } from "@playwright/test";

test.describe("Network Health", () => {
  test("landing page has no failed API requests", async ({ page }) => {
    const failures: string[] = [];

    page.on("response", (res) => {
      // Track non-2xx responses (excluding expected 3xx redirects and analytics)
      if (
        res.status() >= 400 &&
        !res.url().includes("cdn-cgi") &&
        !res.url().includes("favicon")
      ) {
        failures.push(`${res.status()} ${res.url()}`);
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    expect(failures).toHaveLength(0);
  });

  test("pricing page has no failed API requests", async ({ page }) => {
    const failures: string[] = [];

    page.on("response", (res) => {
      if (
        res.status() >= 400 &&
        !res.url().includes("cdn-cgi") &&
        !res.url().includes("favicon")
      ) {
        failures.push(`${res.status()} ${res.url()}`);
      }
    });

    await page.goto("/pricing");
    await page.waitForLoadState("networkidle");

    expect(failures).toHaveLength(0);
  });

  test("dashboard page loads without 5xx errors", async ({ page }) => {
    const serverErrors: string[] = [];

    page.on("response", (res) => {
      if (res.status() >= 500) {
        serverErrors.push(`${res.status()} ${res.url()}`);
      }
    });

    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    expect(serverErrors).toHaveLength(0);
  });

  test("service worker registers successfully", async ({ page }) => {
    await page.goto("/");

    const swRegistered = await page.evaluate(async () => {
      if (!("serviceWorker" in navigator)) return false;

      const reg = await navigator.serviceWorker.getRegistration();
      return !!reg;
    });

    expect(swRegistered).toBe(true);
  });
});
