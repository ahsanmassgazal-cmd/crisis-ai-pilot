import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { name: "mobile_360x800", width: 360, height: 800 },
  { name: "mobile_390x844", width: 390, height: 844 },
  { name: "tablet_768x1024", width: 768, height: 1024 },
  { name: "desktop_1366x768", width: 1366, height: 768 },
  { name: "desktop_1440x900", width: 1440, height: 900 },
  { name: "large_1920x1080", width: 1920, height: 1080 },
];

for (const vp of VIEWPORTS) {
  test(`Audit viewport: ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("/en/app");
    await expect(page.locator("body")).toBeVisible();
    await page.screenshot({ path: `audit/baseline/viewport_${vp.name}.png` });
  });
}
