import { test } from "../fixtures/tokenizedPage"

test.use({
  defaultParams: {
    order: "gift-card",
  },
})

test("should execute a giftcard checkout with valid token", async ({
  checkoutPage,
}) => {
  await checkoutPage.checkOrderSummary("Order Summary")

  await checkoutPage.setCustomerMail()

  await checkoutPage.setBillingAddress()
  await checkoutPage.checkStep("Customer", "open")

  await checkoutPage.save("Customer")

  await checkoutPage.checkStep("Shipping", "not_present")

  await checkoutPage.checkShippingSummary(undefined)

  await checkoutPage.checkStep("Payment", "open")

  await checkoutPage.selectPayment("stripe")

  await checkoutPage.checkPaymentSummary("€10,00")

  await checkoutPage.setPayment("stripe")

  await checkoutPage.save("Payment")
  await checkoutPage.checkPaymentRecap("Visa ending in 4242")
})
