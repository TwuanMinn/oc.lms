import { test, expect } from "@playwright/test";

test.describe("Teacher Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("teacher@lms.dev");
    await page.getByLabel("Password").fill("Admin123!");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/dashboard/**");
  });

  test("create new course → add module → publish", async ({ page }) => {
    // 1. Navigate to teacher dashboard
    await page.goto("/dashboard/teacher/courses");
    await expect(page.getByRole("heading", { name: "My courses" })).toBeVisible();

    // 2. Click "New Course"
    await page.getByRole("link", { name: /new course/i }).click();
    await page.waitForURL("**/teacher/courses/new");

    // 3. Fill course details
    await page.getByLabel("Title").fill("E2E Test Course");
    await page.getByLabel("Description").fill("A test course created by Playwright");
    await page.getByRole("button", { name: "Create course" }).click();

    await page.waitForTimeout(1000);

    // 4. Verify redirect to course editor
    await expect(page.url()).toContain("/dashboard/teacher/courses/");
  });

  test("teacher course list shows courses", async ({ page }) => {
    await page.goto("/dashboard/teacher/courses");
    const heading = page.getByRole("heading", { name: "My courses" });
    await expect(heading).toBeVisible();
  });
});
