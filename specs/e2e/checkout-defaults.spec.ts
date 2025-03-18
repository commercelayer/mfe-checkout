import { faker } from "@faker-js/faker"

import { test, expect } from "../fixtures/tokenizedPage"
import { euAddressNoBillingInfo } from "../utils/addresses"

const customerEmail = faker.internet.email().toLocaleLowerCase()

test.describe("with single defaults", () => {
  test.use({
    defaultParams: {
      market: "LP",
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "TSHIRTMS000000FFFFFFLXXX", quantity: 1 },
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
    await checkoutPage.setBillingAddress(euAddressNoBillingInfo)

    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "close")

    await checkoutPage.checkShippingSummary("FREE")
 
    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.save("Payment")
    await checkoutPage.checkPaymentRecap("Manual Payment")
  })
})

test.describe("with single defaults and customer", () => {
  test.use({
    defaultParams: {
      market: "LP",
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "TSHIRTMS000000FFFFFFLXXX", quantity: 1 },
      ],
      orderAttributes: {
        customer_email: customerEmail,
      },
      addresses: {
        billingAddress: euAddressNoBillingInfo,
        sameShippingAddress: true,
      },
    },
  })

  test("should just place the order", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Customer", "close")

    await checkoutPage.checkStep("Shipping", "close")

    await checkoutPage.checkShippingSummary("FREE")
 
    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.save("Payment")
    await checkoutPage.checkPaymentRecap("Manual Payment")
  })
})

test.describe("with multi shipping single payment defaults", () => {
  test.use({
    defaultParams: {
      market: "UY",
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "TSHIRTMS000000FFFFFFLXXX", quantity: 1 },
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
    await checkoutPage.setBillingAddress(euAddressNoBillingInfo)

    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "close")

    await checkoutPage.checkShippingSummary("FREE")

    await checkoutPage.clickStep("Shipping")

    await checkoutPage.selectShippingMethod({ text: "Express" })

    await checkoutPage.save("Shipping")

    await checkoutPage.checkShippingSummary("10")

    await checkoutPage.checkStep("Payment", "open")
    
    await checkoutPage.save("Payment")
    await checkoutPage.checkPaymentRecap("Manual Payment")
  })
})

test.describe("with multi shipping multi payment defaults", () => {
  test.use({
    defaultParams: {
      market: "VV",
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "TSHIRTMS000000FFFFFFLXXX", quantity: 1 },
      ],
      orderAttributes: {
        customer_email: customerEmail,
      },
      addresses: {
        billingAddress: euAddressNoBillingInfo,
        sameShippingAddress: true
      }
    },
  })

  test("should execute a checkout with valid token", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Customer", "close")

    await checkoutPage.checkStep("Shipping", "close")

    await checkoutPage.checkShippingSummary("FREE")

    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")
    await checkoutPage.checkPaymentRecap("Visa ending in 4242")
  })
})