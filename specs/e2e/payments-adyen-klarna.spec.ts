import { faker } from "@faker-js/faker"

import { test } from "../fixtures/tokenizedPage"
import { deAddress, euAddress2 } from "../utils/addresses"

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
        // Adyen renders the Klarna hosted pages in the `shopperLocale` it receives,
        // which defaults to the order's language and not the billing country. The
        // German address alone only picks the market, so without this the order is
        // English, Klarna hands back an English page and the German labels this
        // flow is driven by stop matching. Setting it also localizes the app's own
        // UI, hence the German assertions below.
        language_code: "de",
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

  // Klarna Pay over time is currently not available in Germany, skipping the test until it's fixed
  test.skip("Checkout order with Pay over time with Klarna", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Bestellübersicht")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("adyen")

    await checkoutPage.completePayment({
      type: "adyen-dropin",
      gateway: "klarna_pay_over_time",
      language: "de",
      confirmationText: "Vielen Dank für deine Bestellung!",
    })

    await checkoutPage.checkPaymentRecap("Klarna endet mit ****")
    await checkoutPage.page.reload()
    await checkoutPage.checkPaymentRecap("Klarna endet mit ****")
  })

  test("Checkout order with Pay Later with Klarna", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Bestellübersicht")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("adyen")

    await checkoutPage.completePayment({
      type: "adyen-dropin",
      gateway: "klarna_pay_later",
      language: "de",
      confirmationText: "Vielen Dank für deine Bestellung!",
    })

    await checkoutPage.checkPaymentRecap("Klarna endet mit ****")
    await checkoutPage.page.reload()
    await checkoutPage.checkPaymentRecap("Klarna endet mit ****")
  })

  test("Checkout order with Pay now with Klarna", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Bestellübersicht")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("adyen")

    await checkoutPage.completePayment({
      type: "adyen-dropin",
      gateway: "klarna_pay_now",
      language: "de",
      confirmationText: "Vielen Dank für deine Bestellung!",
    })

    await checkoutPage.checkPaymentRecap("Klarna paynow endet mit ****")
    await checkoutPage.page.reload()
    await checkoutPage.checkPaymentRecap("Klarna paynow endet mit ****")
  })
})
