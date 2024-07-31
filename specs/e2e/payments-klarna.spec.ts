import { faker } from "@faker-js/faker"
import { euAddress2 } from "specs/utils/addresses"

import { test, expect } from "../fixtures/tokenizedPage"

const customerEmail = faker.internet.email().toLocaleLowerCase()

test.describe("with physical product", () => {
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

  test.skip("should execute a checkout with klarna", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.setCustomerMail()
    await checkoutPage.setBillingAddress({
      ...euAddress2,
      phone: "+393473399466",
    })

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

    await checkoutPage.selectPayment("klarna")

    await checkoutPage.save("Payment", undefined, true)

    await checkoutPage.completePayment({ type: "klarna" })

    await checkoutPage.checkPaymentRecap("Klarna")

    await checkoutPage.page.reload()

    await checkoutPage.checkPaymentRecap("Klarna")
  })
})

test.describe("with digital product", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [{ sku_code: "NFTEBOOK", quantity: 2 }],
      orderAttributes: {
        customer_email: customerEmail,
      },
    },
  })

  test.skip("should execute a checkout with klarna", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.setCustomerMail()
    await checkoutPage.setBillingAddress({
      ...euAddress2,
      phone: "+393473399466",
    })

    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "not_present")

    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.selectPayment("klarna")

    await checkoutPage.save("Payment", undefined, true)

    await checkoutPage.completePayment({ type: "klarna" })

    await checkoutPage.checkPaymentRecap("Klarna")

    await checkoutPage.page.reload()

    await checkoutPage.checkPaymentRecap("Klarna")
  })
})
