import { test, expect } from "../fixtures/tokenizedPage"

test.use({
  defaultParams: {
    order: "bundle+skus",
  },
})

test("should execute a checkout with valid token", async ({ checkoutPage }) => {
  await checkoutPage.checkOrderSummary("Order Summary")

  await checkoutPage.setCustomerMail()

  await checkoutPage.setBillingAddress()
  await checkoutPage.checkStep("Customer", "open")

  await checkoutPage.save("Customer")

  await checkoutPage.checkStep("Shipping", "open")

  await checkoutPage.checkShippingSummary("To be calculated")

  expect(checkoutPage.page.locator("text=Standard Shipping")).toBeVisible()
  await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

  await checkoutPage.checkShippingSummary("FREE")
  await checkoutPage.save("Shipping")

  await checkoutPage.checkStep("Payment", "open")

  await checkoutPage.selectPayment("stripe")

  await checkoutPage.checkPaymentSummary("€10,00")

  await checkoutPage.setPayment("stripe")

  await checkoutPage.save("Payment")

  await checkoutPage.checkPaymentRecap("Visa ending in 4242")
})
