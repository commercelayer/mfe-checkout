import { test, expect } from "../fixtures/tokenizedPage"

// test("should navigate to the 404 page with no params", async ({
//   checkoutPage,
// }) => {
//   // The new page should contain an h1 with "About Page"
//   await expect(
//     tokenizedPage.locator("text=This order is not accessible.")
//   ).toBeVisible()
// })

test("should navigate to checkout with valid token", async ({
  checkoutPage,
}) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  // The new page should contain an h1 with "About Page"
  await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()
})
