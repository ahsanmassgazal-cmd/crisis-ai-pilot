import { test, expect } from "@playwright/test";

const APP_ROUTES = [
  "/app",
  "/app/incidents",
  "/app/incidents/inc-2026-001",
  "/app/incidents/new",
  "/app/notifications",
  "/app/approvals",
  "/app/plans",
  "/app/sites",
  "/app/risks",
  "/app/continuity/bia",
  "/app/drills",
  "/app/compliance",
  "/app/audit",
  "/app/documents",
  "/app/automations",
  "/app/integrations",
  "/app/reports",
  "/owner",
  "/r",
  "/portal",
  "/status/gulf_water",
];

test.describe("Crisis AI Pilot Comprehensive E2E Suite", () => {
  test("loads Command Center directly without access code gate", async ({ page }) => {
    await page.goto("/en/app");
    await expect(page).toHaveTitle(/Crisis AI Pilot/i);
    const header = page.locator("header");
    await expect(header).toBeVisible();
  });

  test("verifies dir='rtl' and dir='ltr' across English and Arabic routes", async ({ page }) => {
    // English
    await page.goto("/en/app");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");

    // Arabic
    await page.goto("/ar/app");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  });

  for (const route of APP_ROUTES) {
    test(`loads /en${route} with status < 400 and zero console errors`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      });

      const response = await page.goto(`/en${route}`);
      expect(response?.status()).toBeLessThan(400);
      await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
      expect(consoleErrors.filter((e) => !e.includes("favicon") && !e.includes("404"))).toHaveLength(0);
    });

    test(`loads /ar${route} with dir='rtl', status < 400 and zero console errors`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      });

      const response = await page.goto(`/ar${route}`);
      expect(response?.status()).toBeLessThan(400);
      await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
      expect(consoleErrors.filter((e) => !e.includes("favicon") && !e.includes("404"))).toHaveLength(0);
    });
  }

  test("runs full 8-minute demo click-path end-to-end", async ({ page }) => {
    // 1. Command Center overview
    await page.goto("/en/app");
    await expect(page.locator("header")).toBeVisible();

    // 2. Incident Command Room
    await page.goto("/en/app/incidents/inc-2026-001");
    await expect(page.locator("body")).toContainText("INC-2026-001");

    // 3. Notifications & Delivery Failover
    await page.goto("/en/app/notifications");
    await expect(page.locator("body")).toContainText("SMS Route A");

    // 4. Approvals Gate
    await page.goto("/en/app/approvals");
    await expect(page.locator("body")).toBeVisible();

    // 5. Responder PWA
    await page.goto("/en/r");
    await expect(page.locator("body")).toBeVisible();

    // 6. Stakeholder Portal
    await page.goto("/en/portal");
    await expect(page.locator("body")).toBeVisible();

    // 7. Founder Multi-Tenant Console
    await page.goto("/en/owner");
    await expect(page.locator("body")).toContainText("Gulf Water");

    // 8. Cryptographic Audit Ledger
    await page.goto("/en/app/audit");
    await expect(page.locator("body")).toBeVisible();
  });
});
