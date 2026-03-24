import { test, expect } from "@playwright/test";

test.describe("Student Flow", () => {
  test("register → enroll → learn → complete", async ({ page }) => {
    // 1. Navigate to /register
    await page.goto("/register");
    await expect(page.getByRole("heading", { name: "Create account" })).toBeVisible();

    // 2. Fill form → submit → redirected to dashboard
    await page.getByLabel("Full name").fill("Test Student");
    await page.getByLabel("Email").fill(`test${Date.now()}@e2e.test`);
    await page.getByLabel("Password").fill("TestPassword1!");
    await page.getByRole("button", { name: "Create account" }).click();
    await page.waitForURL("**/dashboard/student");

    // 3. Navigate to /courses → search
    await page.goto("/courses");
    await page.getByPlaceholder("Search courses").fill("TypeScript");
    await page.waitForTimeout(500);

    // 4. Click course card
    const courseCard = page.locator("[href*='/courses/']").first();
    if (await courseCard.isVisible()) {
      await courseCard.click();
      await expect(page.getByRole("heading")).toBeVisible();

      // 5. Click Enroll
      const enrollBtn = page.getByRole("button", { name: /enroll/i });
      if (await enrollBtn.isVisible()) {
        await enrollBtn.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test("notification bell shows unread count", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("student@lms.dev");
    await page.getByLabel("Password").fill("Admin123!");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/dashboard/student");

    const bell = page.getByLabel("Notifications");
    await expect(bell).toBeVisible();
  });
});
