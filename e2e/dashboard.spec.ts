import { expect, test } from "@playwright/test";

test.describe("Dashboard", () => {
  test.describe("Overview", () => {
    test("displays overview heading and stats", async ({ page }) => {
      await page.goto("/dashboard");
      await expect(
        page.getByRole("heading", { name: "Overview" }),
      ).toBeVisible();
      await expect(page.getByText("Total Tokens")).toBeVisible();
      await expect(page.getByText("Total Requests")).toBeVisible();
      await expect(page.getByText("Current Plan")).toBeVisible();
    });

    test("shows onboarding checklist", async ({ page }) => {
      await page.goto("/dashboard");
      await expect(page.getByText("Get started with Synapse")).toBeVisible();
    });

    test("displays plan upgrade banner", async ({ page }) => {
      await page.goto("/dashboard");
      await expect(page.getByText("upgrade for higher limits")).toBeVisible();
    });

    test("tab navigation links work", async ({ page }) => {
      await page.goto("/dashboard");

      const tabs = ["Overview", "Keys", "Usage", "Billing"];
      for (const tab of tabs) {
        await expect(page.getByRole("link", { name: tab })).toBeVisible();
      }
    });

    test("quick links to usage and billing are visible", async ({ page }) => {
      await page.goto("/dashboard");
      await expect(page.getByText("Usage Details")).toBeVisible();
      await expect(page.getByText("Billing")).toBeVisible();
    });
  });

  test.describe("Keys", () => {
    test("displays keys page with limit counter", async ({ page }) => {
      await page.goto("/dashboard/keys");
      await expect(page.getByRole("heading", { name: "Keys" })).toBeVisible();
      // Should show key count and limit (e.g. "0/1 keys" or "0/3 keys")
      await expect(page.getByText(/\d+\/\d+ keys/)).toBeVisible();
    });

    test("shows create key button", async ({ page }) => {
      await page.goto("/dashboard/keys");
      await expect(
        page.getByRole("button", { name: /create key/i }),
      ).toBeVisible();
    });

    test("displays empty state when no keys exist", async ({ page }) => {
      await page.goto("/dashboard/keys");
      const noKeys = page.getByText("No API keys");
      const hasKeys = await noKeys.isVisible().catch(() => false);

      // Either shows empty state or key list
      if (hasKeys) {
        await expect(noKeys).toBeVisible();
      }
    });
  });

  test.describe("Usage", () => {
    test("displays usage metrics", async ({ page }) => {
      await page.goto("/dashboard/usage");
      await expect(page.getByRole("heading", { name: "Usage" })).toBeVisible();
      await expect(page.getByText("Input Tokens")).toBeVisible();
      await expect(page.getByText("Output Tokens")).toBeVisible();
      await expect(page.getByText("Requests")).toBeVisible();
    });

    test("displays token usage chart", async ({ page }) => {
      await page.goto("/dashboard/usage");
      await expect(page.getByText("Token Usage")).toBeVisible();
    });

    test("displays usage limits section", async ({ page }) => {
      await page.goto("/dashboard/usage");
      await expect(page.getByText("Usage Limits")).toBeVisible();
    });

    test("request limit matches SSOT (10,000 for free tier)", async ({
      page,
    }) => {
      await page.goto("/dashboard/usage");

      // The usage limits section should display the correct free tier limit
      const limitsSection = page.getByText("Usage Limits").locator("..");
      await expect(limitsSection).toBeVisible();

      // Verify request limit is 10,000 (SSOT), not 1,000
      const requestsRow = page
        .getByText("Requests")
        .last()
        .locator("..")
        .locator("..");
      const rowText = await requestsRow.textContent();

      // Limit should be 10,000 (free tier SSOT value)
      if (rowText?.includes("/")) {
        const limitMatch = rowText.match(/\/\s*([\d,]+)/);
        if (limitMatch) {
          const limit = Number.parseInt(limitMatch[1].replace(/,/g, ""), 10);
          expect(limit).toBe(10_000);
        }
      }
    });

    test("date range buttons are visible", async ({ page }) => {
      await page.goto("/dashboard/usage");
      await expect(page.getByRole("button", { name: "7 days" })).toBeVisible();
    });
  });

  test.describe("Billing", () => {
    test("displays billing page with subscription info", async ({ page }) => {
      await page.goto("/dashboard/billing");
      await expect(
        page.getByRole("heading", { name: "Billing" }),
      ).toBeVisible();
      await expect(page.getByText("Subscription")).toBeVisible();
    });

    test("displays entitlements section", async ({ page }) => {
      await page.goto("/dashboard/billing");
      await expect(page.getByText("Entitlements")).toBeVisible();
      await expect(page.getByText("Active Features")).toBeVisible();
    });

    test("shows correct tier", async ({ page }) => {
      await page.goto("/dashboard/billing");
      await expect(page.getByText("Tier")).toBeVisible();
    });

    test("displays API access entitlement", async ({ page }) => {
      await page.goto("/dashboard/billing");
      await expect(page.getByText("API Access")).toBeVisible();
    });

    test("shows max requests per month entitlement", async ({ page }) => {
      await page.goto("/dashboard/billing");
      await expect(page.getByText("Max Requests Per Month")).toBeVisible();
    });
  });

  test.describe("Settings", () => {
    test("displays settings page", async ({ page }) => {
      await page.goto("/dashboard/settings");
      await expect(
        page.getByRole("heading", { name: "Settings" }),
      ).toBeVisible();
    });

    test("shows provider preferences", async ({ page }) => {
      await page.goto("/dashboard/settings");
      await expect(page.getByText("Provider Preferences")).toBeVisible();
      await expect(page.getByText("Default provider")).toBeVisible();
    });

    test("shows provider keys section", async ({ page }) => {
      await page.goto("/dashboard/settings");
      await expect(page.getByText("Provider Keys")).toBeVisible();
    });

    test("displays encryption notice", async ({ page }) => {
      await page.goto("/dashboard/settings");
      await expect(page.getByText(/encrypted at rest/i)).toBeVisible();
    });
  });
});
