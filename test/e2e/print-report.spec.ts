import { test, expect } from "@playwright/test";

test.describe("F1.1: Arabic PDF Report & Shaped Typography Export", () => {
  test("loads Arabic report print page, verifies RTL shaping and downloads PDF", async ({ page }) => {
    await page.goto("/ar/app/reports/print/inc-2026-001");

    // Verify RTL and Arabic typography container
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    const container = page.locator("#report-container");
    await expect(container).toBeVisible();
    await expect(container).toContainText("INC-2026-001");

    // Verify presence of Arabic content shaped by browser engine
    await expect(container).toContainText("عطل في نظام");

    // Verify print & download controls exist
    const printBtn = page.locator("[data-testid='print-window-btn']");
    const downloadBtn = page.locator("[data-testid='download-pdf-btn']");
    await expect(printBtn).toBeVisible();
    await expect(downloadBtn).toBeVisible();

    // Trigger PDF download and assert event
    const downloadPromise = page.waitForEvent("download", { timeout: 15000 });
    await downloadBtn.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
  });
});
