import { faker } from "@faker-js/faker"

import { test } from "../fixtures/tokenizedPage"
import { euAddress2, deAddress } from "../utils/addresses"

test.describe("guest with Adyen and Pay with Klarna in France", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()

  test.use({
    defaultParams: {
      incognito: true,
      order: "with-items",
      orderAttributes: {
        customer_email: customerEmail,
      },
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      addresses: {
        billingAddress: euAddress2,
        sameShippingAddress: true,
      },
    },
  })

  test("Checkout order with Klarna", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("adyen")

    await checkoutPage.completePayment({
      type: "adyen-dropin",
      gateway: "klarna_pay_over_time",
      language: "fr",
    })

    await checkoutPage.checkPaymentRecap("Klarna ending in ****")
    await checkoutPage.page.reload()
    await checkoutPage.checkPaymentRecap("Klarna ending in ****")
  })
})

test.describe("guest with Adyen and Pay with Klarna in Germany", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()

  test.use({
    defaultParams: {
      incognito: true,
      order: "with-items",
      orderAttributes: {
        customer_email: customerEmail,
      },
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      addresses: {
        billingAddress: deAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("Checkout order with Pay over time with Klarna", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("adyen")

    await checkoutPage.completePayment({
      type: "adyen-dropin",
      gateway: "klarna_pay_over_time",
      language: "de",
    })

    await checkoutPage.checkPaymentRecap("Klarna ending in ****")
    await checkoutPage.page.reload()
    await checkoutPage.checkPaymentRecap("Klarna ending in ****")
  })

  test("Checkout order with Pay Later with Klarna", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("adyen")

    await checkoutPage.completePayment({
      type: "adyen-dropin",
      gateway: "klarna_pay_later",
      language: "de",
    })

    await checkoutPage.checkPaymentRecap("Klarna ending in ****")
    await checkoutPage.page.reload()
    await checkoutPage.checkPaymentRecap("Klarna ending in ****")
  })

  test("Checkout order with Pay now with Klarna", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("adyen")

    await checkoutPage.completePayment({
      type: "adyen-dropin",
      gateway: "klarna_pay_now",
      language: "de",
    })

    await checkoutPage.checkPaymentRecap("Klarna paynow ending in ****")
    await checkoutPage.page.reload()
    await checkoutPage.checkPaymentRecap("Klarna paynow ending in ****")
  })
})
