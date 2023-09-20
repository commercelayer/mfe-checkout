import { faker } from "@faker-js/faker"

import { test } from "../fixtures/tokenizedPage"
import { euAddress, usAddress } from "../utils/addresses"

const customerEmail = faker.internet.email().toLocaleLowerCase()

test.describe("plain order", () => {
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

  test("should open customer step", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Customer", "open")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "close")

    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkStep("Customer", "open")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "close")

    await checkoutPage.clickAccordion("Customer")

    await checkoutPage.checkStep("Customer", "open")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "close")

    await checkoutPage.clickStep("Shipping")

    await checkoutPage.checkStep("Customer", "open")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "close")

    await checkoutPage.clickStep("Payment")

    await checkoutPage.checkStep("Customer", "open")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "close")

    await checkoutPage.setCustomerMail()
    await checkoutPage.setBillingAddress()

    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "open")
    await checkoutPage.checkStep("Payment", "close")

    await checkoutPage.clickAccordion("Customer")

    await checkoutPage.checkStep("Customer", "open")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "close")

    await checkoutPage.clickStep("Shipping")

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "open")
    await checkoutPage.checkStep("Payment", "close")

    await checkoutPage.clickAccordion("Customer")

    await checkoutPage.checkStep("Customer", "open")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "close")

    await checkoutPage.clickAccordion("Shipping")

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "open")
    await checkoutPage.checkStep("Payment", "close")

    await checkoutPage.checkShippingSummary("To be calculated")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.checkShippingSummary("FREE")
    await checkoutPage.save("Shipping")

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.clickAccordion("Shipping")

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "open")
    await checkoutPage.checkStep("Payment", "close")

    await checkoutPage.clickAccordion("Payment")

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.checkPaymentSummary("€10,00")

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")
    await checkoutPage.checkPaymentRecap("Visa ending in 4242")
  })
})

test.describe("with customer step completed", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "BABYONBU000000E63E7412MX", quantity: 2 },
      ],
      orderAttributes: {
        customer_email: customerEmail,
      },
      addresses: {
        billingAddress: euAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("select shipping method", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkCustomerEmail(customerEmail)

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "open")
    await checkoutPage.checkStep("Payment", "close")

    await checkoutPage.clickAccordion("Customer")

    await checkoutPage.checkStep("Customer", "open")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "close")

    await checkoutPage.clickAccordion("Shipping")

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "open")
    await checkoutPage.checkStep("Payment", "close")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.clickAccordion("Shipping")

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "open")
    await checkoutPage.checkStep("Payment", "close")

    await checkoutPage.clickAccordion("Payment")

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.clickAccordion("Customer")

    await checkoutPage.checkStep("Customer", "open")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "close")

    await checkoutPage.clickAccordion("Payment")

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")
  })
})

test.describe("with single shipping method", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      market: "US",
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      orderAttributes: {
        customer_email: customerEmail,
      },
    },
  })

  test("shipping step already completed", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.setBillingAddress(usAddress)
    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.clickAccordion("Shipping")

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "open")
    await checkoutPage.checkStep("Payment", "close")

    await checkoutPage.clickAccordion("Payment")

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.checkPaymentSummary("$10.00")

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")
    await checkoutPage.checkPaymentRecap("Visa ending in 4242")
  })
})

test.describe("with single shipping method and customer step completed", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      market: "US",
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      orderAttributes: {
        customer_email: customerEmail,
      },
      addresses: {
        billingAddress: usAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("shipping step already completed", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.clickAccordion("Shipping")

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "open")
    await checkoutPage.checkStep("Payment", "close")

    await checkoutPage.clickAccordion("Payment")

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.checkPaymentSummary("$10.00")

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")
    await checkoutPage.checkPaymentRecap("Visa ending in 4242")
  })
})
