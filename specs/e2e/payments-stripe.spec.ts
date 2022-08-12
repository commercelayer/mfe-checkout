import { faker } from "@faker-js/faker"

import { test, expect } from "../fixtures/tokenizedPage"
import { euAddress } from "../utils/addresses"

const customerEmail = faker.internet.email().toLocaleLowerCase()
const customerPassword = faker.internet.password()

test.describe("customer with Stripe without saving", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      orderAttributes: {
        customer_email: customerEmail,
      },
      customer: {
        email: customerEmail,
        password: customerPassword,
      },
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      addresses: {
        billingAddress: euAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("Checkout order", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("stripe")

    const element = await checkoutPage.page.locator(
      "[data-test-id=payment-save-wallet]"
    )
    expect(element).toBeVisible()
    expect(element).not.toBeChecked()

    await checkoutPage.setPayment("stripe")

    await checkoutPage.checkPaymentSummary("€10,00")

    await checkoutPage.save("Payment")
  })
})

test.describe("customer with Stripe with saving", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      orderAttributes: {
        customer_email: customerEmail,
      },
      customer: {
        email: customerEmail,
        password: customerPassword,
      },
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      addresses: {
        billingAddress: euAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("Checkout order and save customer wallet", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.setPayment("stripe")

    await checkoutPage.checkPaymentSummary("€10,00")

    let element = await checkoutPage.page.locator(
      "[data-test-id=payment-save-wallet]"
    )
    expect(element).toBeVisible()
    expect(element).not.toBeChecked()
    await element.check()
    element = await checkoutPage.page.locator(
      "[data-test-id=payment-save-wallet]"
    )
    expect(element).toBeChecked()

    await checkoutPage.save("Payment")
  })

  test("Checkout order with customer wallet", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.page.waitForTimeout(1000)
    await checkoutPage.page.click("[data-test-id=customer-card]", {
      force: true,
    })
    await checkoutPage.page.waitForTimeout(1000)

    await checkoutPage.checkPaymentSummary("€10,00")

    await checkoutPage.save("Payment")
  })
})

test.describe("guest with Stripe", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()

  test.use({
    defaultParams: {
      order: "with-items",
      orderAttributes: {
        customer_email: customerEmail,
      },
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      addresses: {
        billingAddress: euAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("checkout", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.setPayment("stripe")

    const element = await checkoutPage.page.locator(
      "[data-test-id=payment-save-wallet]"
    )
    expect(element).not.toBeVisible()

    await checkoutPage.setPayment("stripe")

    await checkoutPage.checkPaymentSummary("€10,00")

    await checkoutPage.save("Payment")

    await checkoutPage.checkPaymentRecap("Visa ending in 4242")

    await checkoutPage.page.reload()

    await checkoutPage.checkPaymentRecap("Visa ending in 4242")
  })

  test("checkout changing shipping method", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.page.waitForTimeout(3000)

    await checkoutPage.checkPaymentSummary("€10,00")

    await checkoutPage.clickStep("Shipping")
    await checkoutPage.selectShippingMethod({ text: "Express Delivery" })

    await checkoutPage.save("Shipping")
    await checkoutPage.page.waitForTimeout(2000)
    // await checkoutPage.selectPayment("stripe")
    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")
  })

  test("generic card decline then valid", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.setPayment("stripe", { number: "4000000000000002" })

    await checkoutPage.save("Payment", undefined, true)

    await checkoutPage.checkPaymentError({
      type: "stripe",
      text: "Your card was declined.",
    })
    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")
    await checkoutPage.checkPaymentRecap("Visa ending in 4242")
  })
})

test.describe("stripe errors", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()

  test.use({
    defaultParams: {
      order: "with-items",
      orderAttributes: {
        customer_email: customerEmail,
      },
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      addresses: {
        billingAddress: euAddress,
        sameShippingAddress: true,
      },
    },
  })
  ;[
    {
      kind: "generic decline",
      card: { number: "4000000000000002" },
      error: "Your card was declined.",
    },
    {
      kind: "insufficient funds decline",
      card: { number: "4000000000009995" },
      error: "Your card has insufficient funds.",
    },
    {
      kind: "lost card decline",
      card: { number: "4000000000009987" },
      error: "Your card has been declined.",
    },
    {
      kind: "stolen card decline",
      card: { number: "4000000000009979" },
      error: "Your card has been declined.",
    },
    {
      kind: "expired card decline",
      card: { number: "4000000000000069" },
      error: "Your card has expired.",
    },
    {
      kind: "incorrect CVC card decline",
      card: { number: "4000000000000127" },
      error: "Your card's security code is incorrect.",
    },
    {
      kind: "processing error decline",
      card: { number: "4000000000000119" },
      error:
        "An error occurred while processing your card. Try again in a little bit.",
    },
    {
      kind: "incorrect number decline",
      card: { number: "4242424242424241" },
      error: "Your card number is invalid.",
    },
    {
      kind: "invalid expiry year decline",
      card: { exp: "1221" },
      error: "Your card's expiration year is in the past.",
    },
    {
      kind: "incomplete cvc decline",
      card: { cvc: "12" },
      error: "Your card's security code is incomplete.",
    },
  ].forEach(({ kind, card, error }) => {
    test(kind, async ({ checkoutPage }) => {
      await checkoutPage.checkOrderSummary("Order Summary")

      await checkoutPage.checkStep("Shipping", "open")

      await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

      await checkoutPage.save("Shipping")

      await checkoutPage.selectPayment("stripe")

      await checkoutPage.setPayment("stripe", { ...card })

      await checkoutPage.save("Payment", undefined, true)

      await checkoutPage.checkPaymentError({
        type: "stripe",
        text: error,
      })
    })
  })
})
