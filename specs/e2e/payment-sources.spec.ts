import { faker } from "@faker-js/faker"

import { test, expect } from "../fixtures/tokenizedPage"
import { euAddress } from "../utils/addresses"

const TIMEOUT = 2000

test.describe("payment source amount mismatch with stripe", () => {
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

  test("checkout changing shipping method", async ({ checkoutPage }) => {
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()

    const element = await checkoutPage.page.locator("[data-cy=step_shipping]")
    expect(element).toHaveAttribute("data-status", "true")

    await checkoutPage.page.click(
      "[data-cy=shipping-methods-container] >> text=Standard Shipping"
    )
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.save("Shipping")

    await checkoutPage.page.click(
      "[data-test-id=stripe_payments] >> text=Credit card",
      { force: true }
    )

    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.checkPaymentSummary("€10,00")

    await checkoutPage.checkTotalAmount("€109,00")

    await checkoutPage.clickStep("Shipping")

    await checkoutPage.page.click(
      "[data-cy=shipping-methods-container] >> text=Express Delivery"
    )
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.checkTotalAmount("€121,00")

    await checkoutPage.save("Shipping")

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")
  })

  test("checkout applying coupon", async ({ checkoutPage }) => {
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()

    const element = await checkoutPage.page.locator("[data-cy=step_shipping]")
    expect(element).toHaveAttribute("data-status", "true")

    await checkoutPage.page.click(
      "[data-cy=shipping-methods-container] >> text=Standard Shipping"
    )

    await checkoutPage.save("Shipping")
    await checkoutPage.checkTotalAmount("€99,00")

    await checkoutPage.page.click(
      "[data-test-id=stripe_payments] >> text=Credit card",
      { force: true }
    )
    await checkoutPage.checkTotalAmount("€109,00")

    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.setCoupon("testcoupon")
    await checkoutPage.checkTotalAmount("€79,30")

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")
  })
})

test.describe("payment source amount mismatch for coupon with stripe", () => {
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
      couponCode: "testcoupon",
    },
  })

  test("checkout remove coupon", async ({ checkoutPage }) => {
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

    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.removeCoupon()

    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")
  })
})

test.describe("payment source amount mismatch with paypal", () => {
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

  test("checkout changing shipping method", async ({ checkoutPage }) => {
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()

    const element = await checkoutPage.page.locator("[data-cy=step_shipping]")
    expect(element).toHaveAttribute("data-status", "true")

    await checkoutPage.page.click(
      "[data-cy=shipping-methods-container] >> text=Standard Shipping"
    )
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.save("Shipping")

    await checkoutPage.page.click(
      "[data-test-id=paypal_payments] >> text=PayPal",
      { force: true }
    )
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.checkTotalAmount("€99,00")

    await checkoutPage.clickStep("Shipping")

    await checkoutPage.page.click(
      "[data-cy=shipping-methods-container] >> text=Express Delivery"
    )
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.checkTotalAmount("€111,00")

    await checkoutPage.save("Shipping")
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.setPayment("paypal")
    await checkoutPage.page.waitForTimeout(TIMEOUT)

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

  test("checkout applying coupon", async ({ checkoutPage }) => {
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()

    const element = await checkoutPage.page.locator("[data-cy=step_shipping]")
    expect(element).toHaveAttribute("data-status", "true")

    await checkoutPage.page.click(
      "[data-cy=shipping-methods-container] >> text=Standard Shipping"
    )
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.save("Shipping")
    await checkoutPage.checkTotalAmount("€99,00")

    await checkoutPage.page.click(
      "[data-test-id=paypal_payments] >> text=PayPal",
      { force: true }
    )
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.checkTotalAmount("€99,00")

    await checkoutPage.setCoupon("testcoupon")
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.checkTotalAmount("€69,30")

    await checkoutPage.setPayment("paypal")

    await checkoutPage.page.waitForTimeout(TIMEOUT)

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

test.describe("payment source amount mismatch for coupon with paypal", () => {
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
      couponCode: "testcoupon",
    },
  })

  test("checkout remove coupon", async ({ checkoutPage }) => {
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()

    const element = await checkoutPage.page.locator("[data-cy=step_shipping]")
    expect(element).toHaveAttribute("data-status", "true")

    await checkoutPage.page.click(
      "[data-cy=shipping-methods-container] >> text=Standard Shipping"
    )

    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.save("Shipping")

    await checkoutPage.page.click(
      "[data-test-id=paypal_payments] >> text=PayPal",
      { force: true }
    )

    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.removeCoupon()
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.setPayment("paypal")
    await checkoutPage.page.waitForTimeout(TIMEOUT)

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
