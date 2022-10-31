import { faker } from "@faker-js/faker"

import { test } from "../fixtures/tokenizedPage"
import { euAddress } from "../utils/addresses"

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
      error: "Your card has been declined.",
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
