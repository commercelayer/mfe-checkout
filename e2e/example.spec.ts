import { test, expect } from "@playwright/test"

test("should navigate to the 404 page", async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto("http://localhost:3000/")
  // The new page should contain an h1 with "About Page"
  await expect(page.locator("p")).toContainText("404")
})
