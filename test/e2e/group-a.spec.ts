import { test, expect } from "@playwright/test";

test.describe("Group A: Landing Page and Workspace Login", () => {
  test("Landing page renders in English with Explore Demo and Sign In", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("h1")).toContainText("Autonomous Crisis Management");
    await expect(page.locator("text=Explore Demo Workspace")).toBeVisible();
    await expect(page.locator("text=Sign In to Workspace").first()).toBeVisible();
    await expect(page.locator("text=Your Data Stays Private")).toBeVisible();
  });

  test("Landing page renders in Arabic with correct RTL", async ({ page }) => {
    await page.goto("/ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("h1")).toContainText("منظومة القيادة الذاتية");
    await expect(page.locator("text=استكشاف مساحة العرض التجريبية")).toBeVisible();
  });

  test("Login page functions with role presets", async ({ page }) => {
    await page.goto("/en/login");
    await expect(page.locator("h1")).toContainText("Enterprise Sign In");
    await expect(page.locator("text=Platform Owner").first()).toBeVisible();
    await expect(page.locator("text=Crisis Manager").first()).toBeVisible();
  });
});
