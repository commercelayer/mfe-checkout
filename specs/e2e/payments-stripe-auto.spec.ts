import { faker } from "@faker-js/faker"

import { test, expect } from "../fixtures/tokenizedPage"
import { usAddress } from "../utils/addresses"

test.describe("guest with Affirm", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()

  test.use({
    defaultParams: {
      market: "US",
      order: "with-items",
      orderAttributes: {
        customer_email: customerEmail,
      },
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      addresses: {
        billingAddress: usAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("success", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "close")

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.setPayment("stripe-affirm")

    const element = checkoutPage.page.locator(
      "[data-testid=payment-save-wallet]"
    )
    await expect(element).not.toBeVisible()

    await checkoutPage.checkPaymentSummary("$10.00")

    await checkoutPage.save("Payment", undefined, true)

    await checkoutPage.page
      .getByRole("button", { name: "Authorize Test Payment" })
      .click()

    await checkoutPage.checkPaymentRecap("Affirm ending in ****", 15000)

    await checkoutPage.page.reload()

    await checkoutPage.checkPaymentRecap("Affirm ending in ****", 10000)
  })

  test("failing", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "close")

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.setPayment("stripe-affirm")

    const element = checkoutPage.page.locator(
      "[data-testid=payment-save-wallet]"
    )
    await expect(element).not.toBeVisible()

    await checkoutPage.checkPaymentSummary("$10.00")

    await checkoutPage.save("Payment", undefined, true)

    await checkoutPage.page
      .getByRole("button", { name: "Fail Test Payment" })
      .click()

    await checkoutPage.checkPaymentError({
      type: "stripe",
      text: "The payment failed",
    })
  })
})

test.describe("guest with Klarna", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()

  test.use({
    defaultParams: {
      market: "US",
      order: "with-items",
      orderAttributes: {
        customer_email: customerEmail,
      },
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      addresses: {
        billingAddress: usAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("success", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "close")

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.setPayment("stripe-klarna")

    const element = checkoutPage.page.locator(
      "[data-testid=payment-save-wallet]"
    )
    await expect(element).not.toBeVisible()

    await checkoutPage.checkPaymentSummary("$10.00")

    await checkoutPage.save("Payment", undefined, true)

    await checkoutPage.completePayment({
      type: "stripe",
      gateway: "klarna",
      language: "us",
    })

    await checkoutPage.checkPaymentRecap("Klarna ending in ****", 15000)

    await checkoutPage.page.reload()

    await checkoutPage.checkPaymentRecap("Klarna ending in ****", 10000)
  })
})
