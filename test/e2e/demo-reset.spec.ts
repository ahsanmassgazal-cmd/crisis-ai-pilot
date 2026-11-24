import { test, expect } from "@playwright/test";

test.describe("F1.3: Clean Demo Start & Seed Reset (?demo=fresh)", () => {
  test("?demo=fresh auto-resets seed baseline and cleans URL parameter", async ({ page }) => {
    await page.goto("/en/app?demo=fresh");
    await expect(page).toHaveTitle(/Crisis AI Pilot/i);
    await expect(page.locator("header")).toBeVisible();

    // Verify hero stat is intact
    await expect(page.locator("body")).toContainText("41 s");

    // Verify URL parameter was cleaned up
    await expect(page).not.toHaveURL(/\?demo=fresh/);
  });
});
