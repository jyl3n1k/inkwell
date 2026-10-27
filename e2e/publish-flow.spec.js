import { randomUUID } from "node:crypto";
import { test, expect, devices } from "@playwright/test";

const viewports = [
  { name: "mobile", viewport: devices["iPhone 13"].viewport },
  { name: "tablet", viewport: { width: 768, height: 1024 } },
  { name: "desktop", viewport: { width: 1280, height: 800 } },
];

for (const { name, viewport } of viewports) {
  test.describe(`publish flow - ${name}`, () => {
    test.use({ viewport });

    test("a registered user can log in, publish, and browse", async ({ page, request }) => {
      const runId = randomUUID();
      const email = `e2e-${name}-${runId}@example.com`;
      const title = `Hello from ${name} (${runId})`;
      const registered = await request.post("/api/auth/register", {
        data: { email, displayName: "E2E Tester", password: "correcthorse" },
      });
      expect(registered.status()).toBe(201);

      await page.goto("/login");
      await expect(page.getByRole("heading", { level: 1, name: "Log In" })).toBeVisible();
      await page.getByLabel("Email", { exact: true }).fill(email);
      await page.getByLabel("Password", { exact: true }).fill("correcthorse");
      await page.getByRole("button", { name: "Log In", exact: true }).click();
      await expect(page).toHaveURL("/");

      await page.getByRole("link", { name: "Write", exact: true }).click();
      await expect(page.getByRole("heading", { level: 1, name: "Write a new post" })).toBeVisible();
      await page.getByLabel("Title", { exact: true }).fill(title);
      await page.getByLabel("Body", { exact: true }).fill("Published end to end.");
      await page.getByRole("button", { name: "Publish", exact: true }).click();

      await expect(page).toHaveURL("/");
      await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
      await expect(page.getByRole("heading", { level: 1, name: "Feed" })).toBeVisible();

      // Verify the layout fits the viewport at every size, including the tablet.
      expect(await page.evaluate(() =>
        document.documentElement.scrollWidth <= window.innerWidth,
      )).toBe(true);
    });
  });
}
