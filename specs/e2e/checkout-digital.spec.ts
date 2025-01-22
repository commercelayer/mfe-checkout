import { faker } from "@faker-js/faker"

import { test, expect } from "../fixtures/tokenizedPage"
import { euAddress } from "../utils/addresses"

test.describe("with digital product", () => {
  test.use({
    defaultParams: {
      order: "digital",
    },
  })

  test("should execute a digital checkout with valid token", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.setCustomerMail()
    await checkoutPage.checkCustomerAddressesTitle(
      "Fill in your billing address"
    )
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

  test("should calculate taxes after customer step", async ({
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
})

test.describe("one address on wallet and digital", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()
  const customerPassword = faker.internet.password()

  test.use({
    defaultParams: {
      order: "with-items",
      market: "IT",
      customer: {
        email: customerEmail,
        password: customerPassword,
      },
      lineItemsAttributes: [{ sku_code: "NFTEBOOK", quantity: 1 }],
      customerAddresses: [euAddress],
    },
  })

  test("check addresses", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    checkoutPage.page.locator(`text=${customerEmail}`)

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "not_present")
    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.setPayment("stripe")
    await checkoutPage.save("Payment")

    await checkoutPage.checkPaymentRecap("Visa ending in 4242")
  })
})
