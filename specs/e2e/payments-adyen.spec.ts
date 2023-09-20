import { faker } from "@faker-js/faker"

import { test, expect } from "../fixtures/tokenizedPage"
import { euAddress, euAddress2 } from "../utils/addresses"

test.describe("guest with Adyen", () => {
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

  test("Checkout order", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("adyen")

    await checkoutPage.setPayment("adyen")

    await checkoutPage.save("Payment")

    await checkoutPage.checkPaymentRecap("Credit card ending in ****")
    await checkoutPage.checkPaymentRecap("Credit card ending in ****")
  })

  test("Checkout order using Credit Card with 3D Secure 2 authentication", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("adyen")

    await checkoutPage.setPayment("adyen3DS")

    await checkoutPage.save("Payment", undefined, true)

    await checkoutPage.enter3DSecure({ type: "adyen", text: "password" })

    await checkoutPage.page
      .locator(`text=Thank you for your order!`)
      .waitFor({ state: "visible", timeout: 10000 })

    await checkoutPage.checkPaymentRecap(" ending in ****")
    await checkoutPage.page.reload()
    await checkoutPage.checkPaymentRecap(" ending in ****")
  })
})

test.describe("guest with Adyen drop-in", () => {
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

  test("Checkout order with PayPal", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("adyen")

    await checkoutPage.completePayment({
      type: "adyen-dropin",
      gateway: "paypal",
    })

    await checkoutPage.checkPaymentRecap("PayPal ending in ****")
    await checkoutPage.page.reload()
    await checkoutPage.checkPaymentRecap("PayPal ending in ****")
  })

  test("Checkout order with Credit Card", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("adyen")

    await checkoutPage.completePayment({
      type: "adyen-dropin",
      gateway: "card",
    })

    await checkoutPage.checkPaymentRecap("Credit card ending in ****")
    await checkoutPage.page.reload()
    await checkoutPage.checkPaymentRecap("Credit card ending in ****")
  })

  test("Checkout order with Credit Card and 3D Secure", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("adyen")

    await checkoutPage.completePayment({
      type: "adyen-dropin",
      gateway: "card3DS",
    })

    await checkoutPage.save("Payment", undefined, true)

    await checkoutPage.enter3DSecure({ type: "adyen", text: "password" })

    await checkoutPage.page
      .locator(`text=Thank you for your order!`)
      .waitFor({ state: "visible", timeout: 10000 })
    await checkoutPage.checkPaymentRecap(" ending in ****")
    await checkoutPage.page.reload()
    await checkoutPage.checkPaymentRecap(" ending in ****")
  })
})

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

    const element = await checkoutPage.page.getByTestId("payment-save-wallet")
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

    let element = await checkoutPage.page.getByTestId("payment-save-wallet")
    expect(element).toBeVisible()
    expect(element).not.toBeChecked()
    await element.check()
    element = await checkoutPage.page.getByTestId("payment-save-wallet")
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
})
