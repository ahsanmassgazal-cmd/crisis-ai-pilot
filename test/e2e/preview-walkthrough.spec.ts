import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const PREVIEW_URL = process.env.PREVIEW_URL || "https://crisis-ai-pilot-o52nqftt6-ahsanmassgazal-cmd.vercel.app";
const BYPASS_TOKEN = "M0oSKZQZCih9xd68f59IhukSpylnPPxk";

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "phone", width: 390, height: 844 },
];

test.describe("Visitor Walkthrough on Preview", () => {
  test.beforeAll(() => {
    const dir = path.join(process.cwd(), "audit", "walkthrough");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  for (const vp of VIEWPORTS) {
    test(`Walkthrough on ${vp.name}`, async ({ page, context }) => {
      await context.setExtraHTTPHeaders({
        "x-vercel-protection-bypass": BYPASS_TOKEN,
      });
      await page.setViewportSize({ width: vp.width, height: vp.height });

      // Step 1: Landing page
      await page.goto(`${PREVIEW_URL}/en`, { waitUntil: "domcontentloaded" });
      await expect(page.locator("body")).toBeVisible();
      await page.screenshot({ path: `audit/walkthrough/01_landing_${vp.name}.png` });

      // Step 2: Explore Demo Workspace
      const exploreBtn = page.locator('a[href*="/app"]').first();
      await exploreBtn.click();
      await page.waitForURL("**/app**");
      await page.screenshot({ path: `audit/walkthrough/02_explore_demo_${vp.name}.png` });

      // Step 3: Incidents
      await page.goto(`${PREVIEW_URL}/en/app/incidents`, { waitUntil: "domcontentloaded" });
      await expect(page.locator("body")).toBeVisible();
      await page.screenshot({ path: `audit/walkthrough/03_incidents_${vp.name}.png` });

      // Step 4: Responders
      await page.goto(`${PREVIEW_URL}/en/app/people`, { waitUntil: "domcontentloaded" });
      await expect(page.locator("body")).toBeVisible();
      await page.screenshot({ path: `audit/walkthrough/04_responders_${vp.name}.png` });

      // Step 5: Reset Demo
      const resetBtn = page.locator('button:has-text("Reset Demo"), button:has-text("إعادة ضبط")').first();
      if (await resetBtn.isVisible()) {
        await resetBtn.click();
        await page.waitForTimeout(4000);
      }
      await page.screenshot({ path: `audit/walkthrough/05_reset_demo_${vp.name}.png` });

      // Step 6: Switch to Arabic
      await page.goto(`${PREVIEW_URL}/ar/app`);
      await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
      await page.screenshot({ path: `audit/walkthrough/06_arabic_${vp.name}.png` });

      // Step 7: Sign In page (wrong password rejected)
      await page.goto(`${PREVIEW_URL}/ar/login`, { waitUntil: "domcontentloaded" });
      await page.fill('input[type="email"]', "wrong@example.com");
      await page.fill('input[type="password"]', "WrongPassword123!");
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);
      await expect(page.locator(".bg-rose-50, [class*='rose']").first()).toBeVisible();
      await page.screenshot({ path: `audit/walkthrough/07_login_rejected_${vp.name}.png` });
    });
  }
});
