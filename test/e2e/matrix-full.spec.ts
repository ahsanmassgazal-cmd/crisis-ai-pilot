import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { name: "360x800", width: 360, height: 800 },
  { name: "390x844", width: 390, height: 844 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1366x768", width: 1366, height: 768 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1920x1080", width: 1920, height: 1080 },
];

const THEMES = ["light", "dark"] as const;
const LOCALES = ["en", "ar"] as const;

for (const vp of VIEWPORTS) {
  for (const theme of THEMES) {
    for (const locale of LOCALES) {
      test(`Matrix [${vp.name}] [${theme}] [${locale}]`, async ({ page }) => {
        const consoleErrors: string[] = [];
        page.on("console", (msg) => {
          if (msg.type() === "error") {
            consoleErrors.push(msg.text());
          }
        });

        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.emulateMedia({ colorScheme: theme });

        const targetUrl = `/${locale}/app`;
        const response = await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
        expect(response?.status()).toBeLessThan(400);

        // Verify HTML directionality
        const html = page.locator("html");
        await expect(html).toHaveAttribute("dir", locale === "ar" ? "rtl" : "ltr");
        await expect(html).toHaveAttribute("lang", locale);

        // Verify core layout visibility
        await expect(page.locator("body")).toBeVisible();

        // Check tap targets on visible header & aside buttons in one fast evaluation
        const buttonTargets = await page.evaluate(() => {
          const elements = Array.from(
            document.querySelectorAll<HTMLElement>("header button, aside button")
          );
          return elements
            .filter((el) => {
              const rect = el.getBoundingClientRect();
              const style = window.getComputedStyle(el);
              return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
            })
            .map((el) => {
              const rect = el.getBoundingClientRect();
              return {
                text: el.innerText || el.getAttribute("aria-label") || "",
                height: rect.height,
                width: rect.width,
              };
            });
        });

        for (const target of buttonTargets) {
          expect(
            target.height,
            `Touch target height expected >= 40px, got ${target.height}px for "${target.text}"`
          ).toBeGreaterThanOrEqual(40);
        }

        // Verify no fatal console errors
        const fatalErrors = consoleErrors.filter(
          (err) => !err.includes("Download the React DevTools") && !err.includes("favicon")
        );
        expect(fatalErrors.length).toBe(0);
      });
    }
  }
}
