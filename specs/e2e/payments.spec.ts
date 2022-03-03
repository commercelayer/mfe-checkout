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
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()

    const element = await checkoutPage.page.locator("[data-cy=step_shipping]")
    expect(element).toHaveAttribute("data-status", "true")

    await checkoutPage.page.click(
      "[data-cy=shipping-methods-container] >> text=Standard Shipping"
    )

    await checkoutPage.save("Shipping")

    await checkoutPage.setPayment("paypal")

    await checkoutPage.save("Payment", "Paga con PayPal")

    await checkoutPage.page.fill(
      "input[name=login_email]",
      process.env.NEXT_PUBLIC_PAYPAL_EMAIL as string
    )

    await checkoutPage.page.click("#btnNext")

    await checkoutPage.page.fill(
      "input[name=login_password]",
      process.env.NEXT_PUBLIC_PAYPAL_PASSWORD as string
    )

    await checkoutPage.page.click("#btnLogin")
    await checkoutPage.page.click('[data-testid="submit-button-initial"]')

    await checkoutPage.page
      .locator("text=Order successfully placed!")
      .waitFor({ state: "visible" })
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
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()

    let element = await checkoutPage.page.locator("[data-cy=step_shipping]")
    expect(element).toHaveAttribute("data-status", "true")

    await checkoutPage.page.click(
      "[data-cy=shipping-methods-container] >> text=Standard Shipping"
    )

    await checkoutPage.save("Shipping")

    await checkoutPage.page.click(
      "[data-test-id=stripe_payments] >> text=Credit card",
      { force: true }
    )

    element = await checkoutPage.page.locator("[data-cy=payment-save-wallet]")
    expect(element).toBeVisible()
    expect(element).not.toBeChecked()

    await checkoutPage.setPayment("stripe")

    await checkoutPage.checkPaymentSummary("€10,00")

    await checkoutPage.save("Payment")
  })

  test("Checkout order and save customer wallet", async ({ checkoutPage }) => {
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()

    let element = await checkoutPage.page.locator("[data-cy=step_shipping]")
    expect(element).toHaveAttribute("data-status", "true")

    await checkoutPage.page.click(
      "[data-cy=shipping-methods-container] >> text=Standard Shipping"
    )

    await checkoutPage.save("Shipping")

    await checkoutPage.page.click(
      "[data-test-id=stripe_payments] >> text=Credit card",
      { force: true }
    )

    await checkoutPage.setPayment("stripe")

    await checkoutPage.checkPaymentSummary("€10,00")

    element = await checkoutPage.page.locator("[data-cy=payment-save-wallet]")
    expect(element).toBeVisible()
    expect(element).not.toBeChecked()
    await element.check()
    element = await checkoutPage.page.locator("[data-cy=payment-save-wallet]")
    expect(element).toBeChecked()

    await checkoutPage.save("Payment")
  })

  test("Checkout order with customer wallet", async ({ checkoutPage }) => {
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()

    const element = await checkoutPage.page.locator("[data-cy=step_shipping]")
    expect(element).toHaveAttribute("data-status", "true")

    await checkoutPage.page.click(
      "[data-cy=shipping-methods-container] >> text=Standard Shipping"
    )

    await checkoutPage.save("Shipping")

    await checkoutPage.page.click(
      "[data-test-id=stripe_payments] >> text=Credit card",
      { force: true }
    )

    await checkoutPage.page.click("[data-cy=customer-card]", { force: true })
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
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()

    let element = await checkoutPage.page.locator("[data-cy=step_shipping]")
    expect(element).toHaveAttribute("data-status", "true")

    await checkoutPage.page.click(
      "[data-cy=shipping-methods-container] >> text=Standard Shipping"
    )

    await checkoutPage.save("Shipping")

    await checkoutPage.page.click(
      "[data-test-id=stripe_payments] >> text=Credit card",
      { force: true }
    )
    await checkoutPage.setPayment("stripe")

    element = await checkoutPage.page.locator("[data-cy=payment-save-wallet]")
    expect(element).not.toBeVisible()

    await checkoutPage.setPayment("stripe")

    await checkoutPage.checkPaymentSummary("€10,00")

    await checkoutPage.save("Payment")
  })

  test("checkout changing shipping method", async ({ checkoutPage }) => {
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()

    const element = await checkoutPage.page.locator("[data-cy=step_shipping]")
    expect(element).toHaveAttribute("data-status", "true")

    await checkoutPage.page.click(
      "[data-cy=shipping-methods-container] >> text=Standard Shipping"
    )

    await checkoutPage.save("Shipping")

    await checkoutPage.page.click(
      "[data-test-id=stripe_payments] >> text=Credit card",
      { force: true }
    )

    await checkoutPage.page.waitForTimeout(3000)

    await checkoutPage.checkPaymentSummary("€10,00")

    await checkoutPage.clickStep("Shipping")

    await checkoutPage.page.click(
      "[data-cy=shipping-methods-container] >> text=Express Delivery"
    )

    await checkoutPage.save("Shipping")
    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")
    await checkoutPage.page.waitForTimeout(100000)
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

  test("Change method and checkout", async ({ checkoutPage }) => {
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()

    await checkoutPage.page.click(
      "[data-cy=shipping-methods-container] >> text=Standard Shipping"
    )

    await checkoutPage.save("Shipping")

    await checkoutPage.page.click(
      "[data-test-id=stripe_payments] >> text=Credit card",
      { force: true }
    )

    const element = await checkoutPage.page.locator(
      "[data-cy=payment-save-wallet]"
    )
    expect(element).not.toBeVisible()

    await checkoutPage.checkPlaceOrder("disabled")

    await checkoutPage.setPayment("stripe")

    await checkoutPage.checkPaymentSummary("€10,00")

    await checkoutPage.checkPlaceOrder("enabled")

    await checkoutPage.page.click(
      "[data-test-id=wire_transfers] >> text=Wire transfer",
      { force: true }
    )
    await checkoutPage.checkPlaceOrder("enabled")

    await checkoutPage.save("Payment")
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
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()

    let element = await checkoutPage.page.locator("[data-cy=step_shipping]")
    expect(element).toHaveAttribute("data-status", "true")

    await checkoutPage.page.click(
      "[data-cy=shipping-methods-container] >> text=Standard Shipping"
    )

    await checkoutPage.save("Shipping")

    await checkoutPage.page.click(
      "[data-test-id=braintree_payments] >> text=Credit card",
      { force: true }
    )

    element = await checkoutPage.page.locator("[data-cy=payment-save-wallet]")
    expect(element).toBeVisible()
    expect(element).not.toBeChecked()
    await checkoutPage.checkPlaceOrder("disabled")

    await checkoutPage.setPayment("braintree")
    await checkoutPage.checkPlaceOrder("enabled")

    await checkoutPage.save("Payment", undefined, true)

    const cardinalFrame = checkoutPage.page.frameLocator(
      "text=<head></head> <body> <div></div> </body>"
    )
    await cardinalFrame
      .locator('[placeholder="\\ Enter\\ Code\\ Here"]')
      .fill("1234")

    await cardinalFrame.locator("text=SUBMIT").click()

    await checkoutPage.page
      .locator(`text=Order successfully placed`)
      .waitFor({ state: "visible", timeout: 100000 })
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
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()

    let element = await checkoutPage.page.locator("[data-cy=step_shipping]")
    expect(element).toHaveAttribute("data-status", "true")

    await checkoutPage.page.click(
      "[data-cy=shipping-methods-container] >> text=Standard Shipping"
    )

    await checkoutPage.save("Shipping")

    await checkoutPage.page.click(
      "[data-test-id=adyen_payments] >> text=Credit card",
      { force: true }
    )

    element = await checkoutPage.page.locator("[data-cy=payment-save-wallet]")
    expect(element).toBeVisible()
    expect(element).not.toBeChecked()

    await checkoutPage.setPayment("adyen")

    await checkoutPage.save("Payment")
  })

  test("Checkout order and save customer wallet", async ({ checkoutPage }) => {
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()

    let element = await checkoutPage.page.locator("[data-cy=step_shipping]")
    expect(element).toHaveAttribute("data-status", "true")

    await checkoutPage.page.click(
      "[data-cy=shipping-methods-container] >> text=Standard Shipping"
    )

    await checkoutPage.save("Shipping")

    await checkoutPage.page.click(
      "[data-test-id=adyen_payments] >> text=Credit card",
      { force: true }
    )

    await checkoutPage.setPayment("adyen")

    element = await checkoutPage.page.locator("[data-cy=payment-save-wallet]")
    expect(element).toBeVisible()
    expect(element).not.toBeChecked()
    await element.check()
    element = await checkoutPage.page.locator("[data-cy=payment-save-wallet]")
    expect(element).toBeChecked()

    await checkoutPage.save("Payment")
  })

  test("Checkout order with customer wallet", async ({ checkoutPage }) => {
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()

    const element = await checkoutPage.page.locator("[data-cy=step_shipping]")
    expect(element).toHaveAttribute("data-status", "true")

    await checkoutPage.page.click(
      "[data-cy=shipping-methods-container] >> text=Standard Shipping"
    )

    await checkoutPage.save("Shipping")

    await checkoutPage.page.click(
      "[data-test-id=adyen_payments] >> text=Credit card",
      { force: true }
    )

    await checkoutPage.page.click("[data-cy=customer-card]", { force: true })

    await checkoutPage.save("Payment")
  })
})
