import { faker } from "@faker-js/faker"

import { test, expect } from "../fixtures/tokenizedPage"
import { euAddress } from "../utils/addresses"

const TIMEOUT = 2000

test.describe("guest with Braintree", () => {
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

    await checkoutPage.selectPayment("braintree")

    const element = await checkoutPage.page.locator(
      "[data-testid=payment-save-wallet]"
    )
    expect(element).not.toBeVisible()

    await checkoutPage.setPayment("braintree")

    await checkoutPage.save("Payment", undefined, true)

    const cardinalFrame = checkoutPage.page.frameLocator(
      "text=<head></head> <body> <div></div> </body>"
    )
    await cardinalFrame
      .locator('[placeholder="\\ Enter\\ Code\\ Here"]')
      .fill("1234")

    await cardinalFrame.locator("text=SUBMIT").click()

    await checkoutPage.page
      .locator(`text=Thank you for your order!`)
      .waitFor({ state: "visible", timeout: 100000 })

    await checkoutPage.checkPaymentRecap("Visa ending in 0004")
    await checkoutPage.page.reload()
    await checkoutPage.checkPaymentRecap("Visa ending in 0004")
  })

  test("Checkout order with no 3DS", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("braintree")

    const element = await checkoutPage.page.locator(
      "[data-testid=payment-save-wallet]"
    )
    expect(element).not.toBeVisible()

    await checkoutPage.setPayment("braintree", { number: "4000000000001000" })

    await checkoutPage.save("Payment")

    // const cardinalFrame = checkoutPage.page.frameLocator(
    //   "text=<head></head> <body> <div></div> </body>"
    // )
    // await cardinalFrame
    //   .locator('[placeholder="\\ Enter\\ Code\\ Here"]')
    //   .fill("1234")

    // await cardinalFrame.locator("text=SUBMIT").click()

    // await checkoutPage.page
    //   .locator(`text=Thank you for your order!`)
    //   .waitFor({ state: "visible", timeout: 100000 })

    await checkoutPage.checkPaymentRecap("Visa ending in 1000")
    await checkoutPage.page.reload()
    await checkoutPage.checkPaymentRecap("Visa ending in 1000")
  })

  test("Checkout order with refresh after selecting the payment", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("braintree")

    const element = await checkoutPage.page.locator(
      "[data-testid=payment-save-wallet]"
    )
    expect(element).not.toBeVisible()

    await checkoutPage.page.reload()

    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.setPayment("braintree")

    await checkoutPage.save("Payment", undefined, true)

    const cardinalFrame = checkoutPage.page.frameLocator(
      "text=<head></head> <body> <div></div> </body>"
    )
    await cardinalFrame
      .locator('[placeholder="\\ Enter\\ Code\\ Here"]')
      .fill("1234")

    await cardinalFrame.locator("text=SUBMIT").click()

    await checkoutPage.page
      .locator(`text=Thank you for your order!`)
      .waitFor({ state: "visible", timeout: 100000 })

    await checkoutPage.checkPaymentRecap("Visa ending in 0004")
    await checkoutPage.page.reload()
    await checkoutPage.checkPaymentRecap("Visa ending in 0004")
  })
})

const customerEmail = faker.internet.email().toLocaleLowerCase()
const customerPassword = faker.internet.password()

test.describe("customer with Braintree without saving", () => {
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

    await checkoutPage.checkButton({ type: "Payment", status: "disabled" })

    await checkoutPage.selectPayment("braintree")

    const element = await checkoutPage.page.locator(
      "[data-testid=payment-save-wallet]"
    )
    await expect(element).toBeVisible()
    await expect(element).not.toBeChecked()

    await checkoutPage.setPayment("braintree")
    await checkoutPage.checkButton({ type: "Payment", status: "enabled" })

    await checkoutPage.save("Payment", undefined, true)

    const cardinalFrame = checkoutPage.page.frameLocator(
      "text=<head></head> <body> <div></div> </body>"
    )
    await cardinalFrame
      .locator('[placeholder="\\ Enter\\ Code\\ Here"]')
      .fill("1234")

    await cardinalFrame.locator("text=SUBMIT").click()

    await checkoutPage.page
      .locator(`text=Thank you for your order!`)
      .waitFor({ state: "visible", timeout: 100000 })
  })
})

test.describe("customer with Braintree with saving", () => {
  test.describe.configure({ mode: "serial" })

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

  test("save card and checkout", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("braintree")

    const element = await checkoutPage.page.locator(
      "[data-testid=payment-save-wallet]"
    )
    await expect(element).toBeVisible()
    await expect(element).not.toBeChecked()
    await element.check()

    await checkoutPage.setPayment("braintree")

    await checkoutPage.save("Payment", undefined, true)

    const cardinalFrame = checkoutPage.page.frameLocator(
      "text=<head></head> <body> <div></div> </body>"
    )
    await cardinalFrame
      .locator('[placeholder="\\ Enter\\ Code\\ Here"]')
      .fill("1234")

    await cardinalFrame.locator("text=SUBMIT").click()

    await checkoutPage.page
      .locator(`text=Thank you for your order!`)
      .waitFor({ state: "visible", timeout: 100000 })
  })

  test("with customer wallet", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("braintree")

    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.useCustomerCard()

    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.save("Payment", undefined, true)

    await checkoutPage.page
      .locator(`text=Thank you for your order!`)
      .waitFor({ state: "visible", timeout: 100000 })

    await checkoutPage.checkPaymentRecap("Visa ending in 0004")
  })
})
