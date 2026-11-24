import { test, expect } from "@playwright/test";

test.describe("Crisis AI Pilot E2E Suite", () => {
  test("loads Command Center directly without access code gate", async ({ page }) => {
    await page.goto("/en/app");
    await expect(page).toHaveTitle(/Crisis AI Pilot/i);
    // Verify top bar and Command Center are rendered
    const topBar = page.locator("header");
    await expect(topBar).toBeVisible();
  });

  test("loads Arabic locale with dir='rtl' and logical alignment", async ({ page }) => {
    await page.goto("/ar/app");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
  });

  test("all major navigation routes are reachable without 404", async ({ page }) => {
    const routes = [
      "/en/app",
      "/en/app/incidents",
      "/en/app/incidents/inc-2026-001",
      "/en/app/notifications",
      "/en/app/approvals",
      "/en/app/plans",
      "/en/app/sites",
      "/en/app/risks",
      "/en/app/continuity/bia",
      "/en/app/drills",
      "/en/app/compliance",
      "/en/app/audit",
      "/en/app/documents",
      "/en/owner",
      "/en/r",
      "/en/portal",
      "/en/status/gulf_water",
    ];

    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status()).toBeLessThan(400);
    }
  });
});
