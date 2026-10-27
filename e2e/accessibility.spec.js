import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("feed has no automatically detectable accessibility violations", async ({ page }) => {
  const loaded = page.waitForResponse((response) =>
    response.url().includes("/api/posts?page=1") && response.status() === 200,
  );
  await page.goto("/");
  await loaded;
  await expect(page.getByRole("heading", { level: 1, name: "Feed" })).toBeVisible();
  await expect(page.getByRole("status")).toHaveCount(0);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
