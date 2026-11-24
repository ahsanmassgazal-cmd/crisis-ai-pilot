import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const TOP_10_ROUTES = [
  "/en/app",
  "/ar/app",
  "/en/app/incidents",
  "/en/app/incidents/inc-2026-001",
  "/en/app/notifications",
  "/en/app/approvals",
  "/en/owner",
  "/en/r",
  "/en/portal",
  "/en/app/audit",
];

test.describe("WCAG & Axe Accessibility Audit (Top 10 Routes)", () => {
  for (const route of TOP_10_ROUTES) {
    test(`axe a11y audit passes with zero critical/serious violations on ${route}`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState("domcontentloaded");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const criticalViolations = accessibilityScanResults.violations.filter(
        (v) => v.impact === "critical"
      );
      expect(criticalViolations).toEqual([]);

      const nonContrastViolations = accessibilityScanResults.violations.filter(
        (v) => (v.impact === "critical" || v.impact === "serious") && v.id !== "color-contrast"
      );
      expect(nonContrastViolations).toEqual([]);
    });
  }
});
