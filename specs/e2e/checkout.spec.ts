import { faker } from "@faker-js/faker"

import { test, expect } from "../fixtures/tokenizedPage"

const customerEmail = faker.internet.email().toLocaleLowerCase()

test.use({
  defaultParams: {
    order: "with-items",
    lineItemsAttributes: [
      { sku_code: "BABYONBU000000E63E7412MX", quantity: 2 },
    ],
    orderAttributes: {
      customer_email: customerEmail,
    },
  },
})

test("should execute a checkout with valid token", async ({ checkoutPage }) => {
  await checkoutPage.checkOrderSummary("Order Summary")

  await checkoutPage.setCustomerMail()
  await checkoutPage.checkCustomerAddressesTitle(
    "Fill in your billing/shipping address"
  )
  await checkoutPage.setBillingAddress()

  await checkoutPage.checkStep("Customer", "open")

  await checkoutPage.save("Customer")

  await checkoutPage.checkStep("Shipping", "open")

  await checkoutPage.checkShippingSummary("To be calculated")

  await expect(
    checkoutPage.page.locator("text=Standard Shipping")
  ).toBeVisible()
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

test("should keep shipping and payment methods with a refresh", async ({
  checkoutPage,
}) => {
  await checkoutPage.checkOrderSummary("Order Summary")

  await checkoutPage.setCustomerMail()
  await checkoutPage.setBillingAddress()

  await checkoutPage.checkStep("Customer", "open")

  await checkoutPage.save("Customer")

  await checkoutPage.checkStep("Shipping", "open")

  await checkoutPage.checkShippingSummary("To be calculated")

  await expect(
    checkoutPage.page.locator("text=Standard Shipping")
  ).toBeVisible()
  await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

  await checkoutPage.checkShippingSummary("FREE")
  await checkoutPage.save("Shipping")

  await checkoutPage.checkStep("Payment", "open")

  await checkoutPage.selectPayment("stripe")

  await checkoutPage.checkPaymentSummary("€10,00")

  await checkoutPage.page.reload()

  await checkoutPage.checkStep("Payment", "open")

  await checkoutPage.setPayment("stripe")

  await checkoutPage.save("Payment")
  await checkoutPage.checkPaymentRecap("Visa ending in 4242")
})
