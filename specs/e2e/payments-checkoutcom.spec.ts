import { faker } from "@faker-js/faker"

import { expect, test } from "../fixtures/tokenizedPage"
import { euAddress } from "../utils/addresses"

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

    const element = checkoutPage.page.locator(
      "[data-testid=payment-save-wallet]",
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
      .locator("text=Thank you for your order!")
      .waitFor({ state: "visible", timeout: 100000 })

    await checkoutPage.checkPaymentRecap("Visa ending in 4242")

    await checkoutPage.page.reload()

    await checkoutPage.checkPaymentRecap("Visa ending in 4242")
  })
})

test.describe("guest with checkout.com declined payment and retry", () => {
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

  test("checkout declined", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("checkout_com")

    await checkoutPage.setPayment("checkout_com", {
      number: "371064645462927",
      exp: "12/30",
      cvc: "1234",
    })

    let element = checkoutPage.page.locator("[data-testid=payment-save-wallet]")
    expect(element).not.toBeVisible()

    await checkoutPage.save("Payment", undefined, true)

    await checkoutPage.page.getByRole("button", { name: "Continue" }).click()

    await checkoutPage.page
      .locator("text=Declined")
      .waitFor({ state: "visible", timeout: 100000 })

    await checkoutPage.setPayment("checkout_com")

    element = checkoutPage.page.locator("[data-testid=payment-save-wallet]")
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
      .locator("text=Thank you for your order!")
      .waitFor({ state: "visible", timeout: 100000 })

    await checkoutPage.checkPaymentRecap("Visa ending in 4242")

    await checkoutPage.page.reload()

    await checkoutPage.checkPaymentRecap("Visa ending in 4242")
  })
})

const customerEmail = faker.internet.email().toLocaleLowerCase()
const customerPassword = faker.internet.password()

test.describe("customer with checkout.com without saving", () => {
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

    const element = checkoutPage.page.locator(
      "[data-testid=payment-save-wallet]",
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
      .locator("text=Thank you for your order!")
      .waitFor({ state: "visible", timeout: 100000 })

    await checkoutPage.checkPaymentRecap("Visa ending in 4242")
  })
})

test.describe("customer with checkout.com with saving", () => {
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

  test("save card in customer wallet", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("checkout_com")

    await checkoutPage.setPayment("checkout_com")

    let element = checkoutPage.page.locator("[data-testid=payment-save-wallet]")
    expect(element).toBeVisible()
    expect(element).not.toBeChecked()
    await element.check()
    element = checkoutPage.page.locator("[data-testid=payment-save-wallet]")
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
      .locator("text=Thank you for your order!")
      .waitFor({ state: "visible", timeout: 100000 })

    await checkoutPage.checkPaymentRecap("Visa ending in 4242")
  })

  test("use card in customer wallet", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("checkout_com")

    await checkoutPage.useCustomerCard()

    await checkoutPage.save("Payment")

    await checkoutPage.checkPaymentRecap("Visa ending in 4242")
  })
})

test.describe("guest with checkout.com as single payment method", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()

  test.use({
    defaultParams: {
      order: "with-items",
      market: "PT",
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

    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")

    const element = checkoutPage.page.locator(
      "[data-testid=payment-save-wallet]",
    )
    expect(element).not.toBeVisible()

    await checkoutPage.setPayment("checkout_com")

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
      .locator("text=Thank you for your order!")
      .waitFor({ state: "visible", timeout: 100000 })

    await checkoutPage.checkPaymentRecap("Visa ending in 4242")

    await checkoutPage.page.reload()

    await checkoutPage.checkPaymentRecap("Visa ending in 4242")
  })
})
