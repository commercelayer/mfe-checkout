import { test } from "../fixtures/tokenizedPage"

test.describe("en context", () => {
  test.use({
    defaultParams: {
      order: "plain",
      orderAttributes: { language_code: "en" },
    },
  })

  test("should navigate to english checkout", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
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
    await checkoutPage.checkOrderSummary("Riepilogo Ordine")
  })
})

test.describe("locale context", () => {
  test.use({
    defaultParams: {
      order: "plain",
      orderAttributes: { language_code: "it-IT" },
    },
  })

  test("should navigate to italian checkout", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Riepilogo Ordine")
  })
})
