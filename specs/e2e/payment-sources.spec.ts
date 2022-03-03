import { faker } from "@faker-js/faker"

import { test, expect } from "../fixtures/tokenizedPage"
import { euAddress } from "../utils/addresses"

test.describe("payment source amount mismatch", () => {
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
  })

  test("checkout applying coupon", async ({ checkoutPage }) => {
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

    await checkoutPage.setCoupon("testcoupon")

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")
  })
})

test.describe("payment source amount mismatch for coupon", () => {
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

    await checkoutPage.page.waitForTimeout(3000)

    await checkoutPage.removeCoupon()

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")
  })
})
