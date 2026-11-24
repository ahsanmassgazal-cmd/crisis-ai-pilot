import { test, expect } from "@playwright/test";

test.describe("F1.2: Responder ↔ Commander Live Sync (BroadcastChannel)", () => {
  test("cross-page live sync: tapping 'I'm safe' in /r updates incident room ack count within 2s", async ({
    browser,
  }) => {
    const context = await browser.newContext();
    const commanderPage = await context.newPage();
    const responderPage = await context.newPage();

    // 1. Open Incident Room in commander page
    await commanderPage.goto("/en/app/incidents/inc-2026-001");
    const ackCount = commanderPage.locator("[data-testid='responder-ack-count']");
    await expect(ackCount).toBeVisible();
    await expect(ackCount).toHaveText("14 / 16");

    // 2. Open Responder PWA in responder page
    await responderPage.goto("/en/r");
    const imSafeBtn = responderPage.locator("[data-testid='responder-im-safe-btn']");
    await expect(imSafeBtn).toBeVisible();

    // 3. Tap "I'm safe" on responder page
    await imSafeBtn.click();

    // 4. Verify commander page ack count updates live to "15 / 16" within 2 seconds
    await expect(ackCount).toHaveText("15 / 16", { timeout: 2000 });

    // 5. Test Presenter Phone Preview button and iframe in commander page
    const phonePreviewBtn = commanderPage.locator("[data-testid='responder-phone-preview-btn']");
    if (await phonePreviewBtn.isVisible()) {
      await phonePreviewBtn.click();
      const phoneFrame = commanderPage.locator("[data-testid='responder-phone-preview-frame']");
      await expect(phoneFrame).toBeVisible();
    }

    await context.close();
  });
});
