import { test, expect } from "@playwright/test";

const ROUTES = [
  { path: "/en/app", name: "command-center-en" },
  { path: "/ar/app", name: "command-center-ar" },
  { path: "/en/app/incidents", name: "incidents-en" },
  { path: "/ar/app/incidents", name: "incidents-ar" },
  { path: "/en/app/incidents/inc-2026-001", name: "incident-room-en" },
  { path: "/ar/app/incidents/inc-2026-001", name: "incident-room-ar" },
  { path: "/en/app/incidents/new", name: "incident-new-en" },
  { path: "/en/app/notifications", name: "notifications-en" },
  { path: "/en/app/approvals", name: "approvals-en" },
  { path: "/en/app/plans", name: "plans-en" },
  { path: "/en/app/sites", name: "sites-en" },
  { path: "/en/app/risks", name: "risks-en" },
  { path: "/en/app/continuity/bia", name: "bia-en" },
  { path: "/en/app/continuity/functions", name: "functions-en" },
  { path: "/en/app/continuity/recovery", name: "recovery-en" },
  { path: "/en/app/drills", name: "drills-en" },
  { path: "/en/app/compliance", name: "compliance-en" },
  { path: "/en/app/audit", name: "audit-en" },
  { path: "/en/app/documents", name: "documents-en" },
  { path: "/en/app/automations", name: "automations-en" },
  { path: "/en/app/integrations", name: "integrations-en" },
  { path: "/en/app/reports", name: "reports-en" },
  { path: "/en/app/reports/print/inc-2026-001", name: "reports-print-en" },
  { path: "/ar/app/reports/print/inc-2026-001", name: "reports-print-ar" },
  { path: "/en/app/settings", name: "settings-en" },
  { path: "/en/app/templates", name: "templates-en" },
  { path: "/en/app/triggers", name: "triggers-en" },
  { path: "/en/app/people", name: "people-en" },
  { path: "/en/app/lessons", name: "lessons-en" },
  { path: "/en/app/wall", name: "wall-en" },
  { path: "/en/app/focus", name: "focus-en" },
  { path: "/en/app/data", name: "data-en" },
  { path: "/en/app/status-page", name: "status-page-en" },
  { path: "/en/owner", name: "owner-en" },
  { path: "/en/r", name: "responder-r-en" },
  { path: "/ar/r", name: "responder-r-ar" },
  { path: "/en/portal", name: "portal-en" },
  { path: "/ar/portal", name: "portal-ar" },
  { path: "/en/status/gulf_water", name: "status-public-en" },
  { path: "/en/login", name: "login-en" },
];

test.describe("Stage 0 Baseline Smoke Suite", () => {
  for (const r of ROUTES) {
    test(`smoke check & snapshot: ${r.path}`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      });

      const response = await page.goto(r.path, { timeout: 15000 });
      expect(response?.status()).toBeLessThan(400);

      // Verify page is rendered and no endless loader remains
      await page.waitForLoadState("domcontentloaded");
      const body = page.locator("body");
      await expect(body).toBeVisible();

      // Check main element or container is visible within 5s
      const main = page.locator("main, [role='main'], .min-h-screen").first();
      await expect(main).toBeVisible({ timeout: 5000 });

      // Take baseline screenshot
      await page.screenshot({
        path: `audit/baseline/${r.name}.png`,
        fullPage: false,
      });

      // Filter out non-actionable warnings
      const filtered = consoleErrors.filter(
        (e) => !e.includes("favicon") && !e.includes("404")
      );
      expect(filtered).toHaveLength(0);
    });
  }
});
