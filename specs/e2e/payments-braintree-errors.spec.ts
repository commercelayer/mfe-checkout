import { faker } from "@faker-js/faker"

import { test } from "../fixtures/tokenizedPage"
import { euAddress } from "../utils/addresses"

test.describe("braintree errors", () => {
  ;[
    {
      kind: "do not honor",
      code: 2000,
      error: "Do not honor",
    },
    {
      kind: "insufficient funds",
      code: 2001,
      error: "Insufficient funds",
    },
    {
      kind: "limit exceeded",
      code: 2002,
      error: "Limit exceeded",
    },
  ].forEach(({ kind, code, error }) => {
    test.describe(kind, () => {
      const customerEmail = faker.internet.email().toLocaleLowerCase()

      test.use({
        defaultParams: {
          order: "with-items",
          orderAttributes: {
            customer_email: customerEmail,
          },
          lineItemsAttributes: [{ sku_code: "BRAINTREETEST", quantity: code }],
          addresses: {
            billingAddress: euAddress,
            sameShippingAddress: true,
          },
        },
      })

      test("error", async ({ checkoutPage }) => {
        await checkoutPage.checkOrderSummary("Order Summary")

        await checkoutPage.checkStep("Shipping", "open")

        await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

        await checkoutPage.save("Shipping")

        await checkoutPage.selectPayment("braintree")

        await checkoutPage.setPayment("braintree")

        await checkoutPage.save("Payment", undefined, true)

        const cardinalFrame = checkoutPage.page.frameLocator(
          "text=<head></head> <body> <div></div> </body>"
        )
        await cardinalFrame
          .locator('[placeholder="\\ Enter\\ Code\\ Here"]')
          .fill("1234")

        await cardinalFrame.locator("text=SUBMIT").click()

        await checkoutPage.checkPaymentError({
          type: "braintree",
          text: error,
        })
      })
    })
  })
})
