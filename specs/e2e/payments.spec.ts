import { faker } from "@faker-js/faker"

import { test, expect } from "../fixtures/tokenizedPage"
import { euAddress } from "../utils/addresses"

test.describe("guest with Paypal", () => {
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

    await checkoutPage.setPayment("paypal")

    await checkoutPage.save("Payment", "Paga con PayPal")

    await checkoutPage.checkPaymentRecap("PayPal")
    await checkoutPage.page.reload()

    await checkoutPage.checkPaymentRecap("PayPal")
  })
})

test.describe("customer with Stripe", () => {
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

test.describe("guest with checkout.com", () => {
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

    await checkoutPage.selectPayment("checkout_com")

    await checkoutPage.setPayment("checkout_com")

    const element = await checkoutPage.page.locator(
      "[data-test-id=payment-save-wallet]"
    )
    expect(element).not.toBeVisible()

    await checkoutPage.save("Payment", undefined, true)

    await checkoutPage.page
      .frameLocator('iframe[name="cko-3ds2-iframe"]')
      .locator("#password")
      .fill("Checkout1!")

    await checkoutPage.page
      .frameLocator('iframe[name="cko-3ds2-iframe"]')
      .locator("text=Continue")
      .click()

    await checkoutPage.page
      .locator(`text=Thank you for your order!`)
      .waitFor({ state: "visible", timeout: 100000 })

    await checkoutPage.checkPaymentRecap("Visa ending in 4242")

    await checkoutPage.page.reload()

    await checkoutPage.checkPaymentRecap("Visa ending in 4242")
  })
})

test.describe("customer with checkout.com", () => {
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

  test("checkout", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("checkout_com")

    await checkoutPage.setPayment("checkout_com")

    const element = await checkoutPage.page.locator(
      "[data-test-id=payment-save-wallet]"
    )
    expect(element).toBeVisible()
    expect(element).not.toBeChecked()

    await checkoutPage.save("Payment", undefined, true)

    await checkoutPage.page
      .frameLocator('iframe[name="cko-3ds2-iframe"]')
      .locator("#password")
      .fill("Checkout1!")

    await checkoutPage.page
      .frameLocator('iframe[name="cko-3ds2-iframe"]')
      .locator("text=Continue")
      .click()

    await checkoutPage.page
      .locator(`text=Thank you for your order!`)
      .waitFor({ state: "visible", timeout: 100000 })

    await checkoutPage.checkPaymentRecap("Visa ending in 4242")
  })

  test("save card in customer wallet", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("checkout_com")

    await checkoutPage.setPayment("checkout_com")

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

    await checkoutPage.save("Payment", undefined, true)

    await checkoutPage.page
      .frameLocator('iframe[name="cko-3ds2-iframe"]')
      .locator("#password")
      .fill("Checkout1!")

    await checkoutPage.page
      .frameLocator('iframe[name="cko-3ds2-iframe"]')
      .locator("text=Continue")
      .click()

    await checkoutPage.page
      .locator(`text=Thank you for your order!`)
      .waitFor({ state: "visible", timeout: 100000 })

    await checkoutPage.checkPaymentRecap("Visa ending in 4242")
  })

  test("use card in customer wallet", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("checkout_com")

    await checkoutPage.page.click("[data-test-id=customer-card]", {
      force: true,
    })

    await checkoutPage.save("Payment")

    await checkoutPage.checkPaymentRecap("Visa ending in 4242")
  })
})

test.describe("guest with wire transfer", () => {
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

  test("Checkout", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.checkButton({ type: "Payment", status: "disabled" })

    await checkoutPage.selectPayment("wire")

    await checkoutPage.checkButton({ type: "Payment", status: "enabled" })

    await checkoutPage.save("Payment")

    await checkoutPage.checkPaymentRecap("Wire transfer")

    await checkoutPage.page.reload()

    await checkoutPage.checkPaymentRecap("Wire transfer")
  })

  test("Change method and checkout", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("stripe")

    const element = await checkoutPage.page.locator(
      "[data-test-id=payment-save-wallet]"
    )
    expect(element).not.toBeVisible()

    await checkoutPage.setPayment("stripe")

    await checkoutPage.checkPaymentSummary("€10,00")

    await checkoutPage.checkButton({ type: "Payment", status: "enabled" })

    await checkoutPage.selectPayment("wire")
    await checkoutPage.page.waitForTimeout(1500)

    await checkoutPage.checkButton({ type: "Payment", status: "enabled" })

    await checkoutPage.save("Payment")
  })
})

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
      "[data-test-id=payment-save-wallet]"
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

    await checkoutPage.checkPaymentRecap("Visa ending in 1111")
    await checkoutPage.page.reload()
    await checkoutPage.checkPaymentRecap("Visa ending in 1111")
  })
})

test.describe("customer with Braintree", () => {
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

    await checkoutPage.selectPayment("braintree")

    const element = await checkoutPage.page.locator(
      "[data-test-id=payment-save-wallet]"
    )
    await expect(element).toBeVisible()
    await expect(element).not.toBeChecked()
    await checkoutPage.checkButton({ type: "Payment", status: "disabled" })

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

  test("save card and checkout", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("braintree")

    const element = await checkoutPage.page.locator(
      "[data-test-id=payment-save-wallet]"
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

    await checkoutPage.page.click("[data-test-id=customer-card]", {
      force: true,
    })

    await checkoutPage.page.waitForTimeout(2000)

    await checkoutPage.save("Payment", undefined, true)

    await checkoutPage.page
      .locator(`text=Thank you for your order!`)
      .waitFor({ state: "visible", timeout: 100000 })

    await checkoutPage.checkPaymentRecap("Visa ending in 1111")
  })
})

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
    await checkoutPage.page.reload()
    await checkoutPage.checkPaymentRecap("Credit card ending in ****")
  })
})

test.describe("customer with Adyen", () => {
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

    const element = await checkoutPage.page.locator(
      "[data-test-id=payment-save-wallet]"
    )
    expect(element).toBeVisible()
    expect(element).not.toBeChecked()

    await checkoutPage.setPayment("adyen")

    await checkoutPage.save("Payment")
  })

  test("Checkout order and save customer wallet", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("adyen")

    await checkoutPage.setPayment("adyen")

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
    await checkoutPage.selectPayment("adyen")

    await checkoutPage.page.click("[data-test-id=customer-card]", {
      force: true,
    })

    await checkoutPage.save("Payment")
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
