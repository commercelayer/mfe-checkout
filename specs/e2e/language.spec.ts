import { test, expect } from "../fixtures/tokenizedPage"

test.describe("en context", () => {
  test.use({
    defaultParams: {
      order: "plain",
      orderAttributes: { language_code: "en" },
    },
  })

  test("should navigate to english checkout", async ({ checkoutPage }) => {
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()
  })
})

test.describe("it context", () => {
  test.use({
    defaultParams: {
      order: "plain",
      orderAttributes: { language_code: "it" },
    },
  })

  test("should navigate to italian checkout", async ({ checkoutPage }) => {
    await expect(
      checkoutPage.page.locator("text=Riepilogo Ordine")
    ).toBeVisible()
  })
})
