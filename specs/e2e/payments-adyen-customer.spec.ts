import { faker } from "@faker-js/faker"

import { test, expect } from "../fixtures/tokenizedPage"
import { euAddress } from "../utils/addresses"

test.describe("customer with Adyen without saving", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()
  const customerPassword = faker.internet.password()

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

    await checkoutPage.selectPayment("adyen")

    const element = checkoutPage.page.getByTestId("payment-save-wallet")
    expect(element).toBeVisible()
    expect(element).not.toBeChecked()

    await checkoutPage.setPayment("adyen")

    await checkoutPage.save("Payment")
  })
})

test.describe("customer with Adyen with saving", () => {
  test.describe.configure({ mode: "serial" })

  const customerEmail = faker.internet.email().toLocaleLowerCase()
  const customerPassword = faker.internet.password()

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

    await checkoutPage.selectPayment("adyen")

    await checkoutPage.setPayment("adyen")

    let element = checkoutPage.page.getByTestId("payment-save-wallet")
    expect(element).toBeVisible()
    expect(element).not.toBeChecked()
    await element.check()
    element = checkoutPage.page.getByTestId("payment-save-wallet")
    expect(element).toBeChecked()

    await checkoutPage.save("Payment")
  })

  test("Checkout order with customer wallet", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")
    await checkoutPage.selectPayment("adyen")

    await checkoutPage.useCustomerCard()

    await checkoutPage.save("Payment")
  })

  test("Checkout order with customer wallet and reload when card selected", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")
    await checkoutPage.selectPayment("adyen")

    await checkoutPage.useCustomerCard()

    await checkoutPage.page.reload()

    await checkoutPage.page.waitForTimeout(2000)

    const element = checkoutPage.page.getByTestId("payment-save-wallet")
    expect(element).not.toBeVisible()
    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.save("Payment")

    await checkoutPage.checkPaymentRecap(" ending in ****")
    await checkoutPage.page.reload()
    await checkoutPage.checkPaymentRecap(" ending in ****")
  })
})
