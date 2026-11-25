import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const ROUTES = [
  { name: "landing", path: "" },
  { name: "login", path: "/login" },
  { name: "command_center", path: "/app" },
  { name: "incidents", path: "/app/incidents" },
  { name: "incident_room", path: "/app/incidents/inc-2026-001" },
  { name: "new_incident", path: "/app/incidents/new" },
  { name: "attention_queue", path: "/app/focus" },
  { name: "notifications", path: "/app/notifications" },
  { name: "approvals", path: "/app/approvals" },
  { name: "templates", path: "/app/templates" },
  { name: "status_page", path: "/app/status-page" },
  { name: "people", path: "/app/people" },
  { name: "plans", path: "/app/plans" },
  { name: "sites", path: "/app/sites" },
  { name: "risks", path: "/app/risks" },
  { name: "bia", path: "/app/continuity/bia" },
  { name: "critical_functions", path: "/app/continuity/functions" },
  { name: "recovery", path: "/app/continuity/recovery" },
  { name: "drills", path: "/app/drills" },
  { name: "automations", path: "/app/automations" },
  { name: "triggers", path: "/app/triggers" },
  { name: "integrations", path: "/app/integrations" },
  { name: "documents", path: "/app/documents" },
  { name: "import_export", path: "/app/data" },
  { name: "reports", path: "/app/reports" },
  { name: "lessons", path: "/app/lessons" },
  { name: "compliance", path: "/app/compliance" },
  { name: "audit", path: "/app/audit" },
  { name: "settings", path: "/app/settings" },
  { name: "wall_mode", path: "/app/wall" },
  { name: "owner_console", path: "/owner" },
  { name: "responder_pwa", path: "/r" },
  { name: "stakeholder_portal", path: "/portal" },
  { name: "public_status", path: "/status/gulf_water" },
];

const LOCALES = ["en", "ar"] as const;
const THEMES = ["light", "dark"] as const;
const VIEWPORT = { width: 360, height: 800 };

test.describe("360x800 Visual Checks (EN & AR, Light & Dark)", () => {
  test.beforeAll(() => {
    const dir = path.join(process.cwd(), "audit", "visual", "360px");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  for (const route of ROUTES) {
    for (const locale of LOCALES) {
      for (const theme of THEMES) {
        test(`360x800: ${route.name} [${locale}] [${theme}]`, async ({ page }) => {
          await page.setViewportSize(VIEWPORT);
          await page.emulateMedia({ colorScheme: theme });

          const url = `/${locale}${route.path}`;
          const res = await page.goto(url, { waitUntil: "domcontentloaded" });
          expect(res?.status()).toBeLessThan(400);

          await page.waitForTimeout(300);

          // Check no horizontal scrollbar / cut off
          const overflowX = await page.evaluate(() => {
            return document.documentElement.scrollWidth <= window.innerWidth + 5;
          });
          expect(overflowX, `Horizontal overflow on 360x800: ${route.name} (${locale}, ${theme})`).toBe(true);

          // Check dir attribute for RTL
          if (locale === "ar") {
            const dir = await page.getAttribute("html", "dir");
            expect(dir).toBe("rtl");
          }

          const filename = `${route.name}_360x800_${locale}_${theme}.png`;
          await page.screenshot({ path: `audit/visual/360px/${filename}` });
        });
      }
    }
  }
});
