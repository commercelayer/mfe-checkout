import exp from "constants"

import { test, expect } from "../fixtures/tokenizedPage"

test.describe("with coupon code", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "SWEETSMUB7B7B7E63E74LXXX", quantity: 9 },
      ],
      couponCode: "testcoupon",
    },
  })

  test("should execute a checkout", async ({ checkoutPage }) => {
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()
    await checkoutPage.setCustomerMail()
    await checkoutPage.setBillingAddress()
    let element = await checkoutPage.page.locator("[data-cy=step_customer]")
    expect(element).toHaveAttribute("data-status", "true")
    await checkoutPage.save("Customer")

    element = await checkoutPage.page.locator("[data-cy=step_shipping]")
    expect(element).toHaveAttribute("data-status", "true")

    await checkoutPage.checkShippingSummary("To be calculated")
    expect(checkoutPage.page.locator("text=Standard Shipping")).toBeVisible()
    await checkoutPage.page.click(
      "[data-cy=shipping-methods-container] >> text=Standard Shipping"
    )

    await checkoutPage.checkShippingSummary("FREE")
    await checkoutPage.save("Shipping")
    await checkoutPage.checkCouponCode("TESTCOUPON")
    await checkoutPage.checkDiscountAmount("-€94,50")

    element = await checkoutPage.page.locator("[data-cy=step_payment]")
    expect(element).toHaveAttribute("data-status", "true")
    expect(
      checkoutPage.page.locator(
        "[data-test-id=stripe_payments] >> text=Credit Card"
      )
    ).toBeVisible()
    await checkoutPage.page.click(
      "[data-test-id=stripe_payments] >> text=Credit card",
      { force: true }
    )
    await checkoutPage.checkPaymentSummary("€10,00")

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")

    expect(
      checkoutPage.page.locator("text=Order successfully placed!")
    ).toBeVisible()

    expect(
      checkoutPage.page.locator(
        "[data-cy=payment-recap] >> text=Visa ending in 4242"
      )
    ).toBeVisible()
  })
})

test.describe("without coupon code", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "SWEETSMUB7B7B7E63E74LXXX", quantity: 9 },
      ],
    },
  })

  test("should execute a checkout with discount", async ({ checkoutPage }) => {
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()
    await checkoutPage.setCustomerMail("customer@tk.com")
    await checkoutPage.setBillingAddress()
    let element = await checkoutPage.page.locator("[data-cy=step_customer]")
    expect(element).toHaveAttribute("data-status", "true")
    await checkoutPage.save("Customer")

    element = await checkoutPage.page.locator("[data-cy=step_shipping]")
    expect(element).toHaveAttribute("data-status", "true")

    await checkoutPage.checkShippingSummary("To be calculated")
    expect(checkoutPage.page.locator("text=Standard Shipping")).toBeVisible()
    await checkoutPage.page.click(
      "[data-cy=shipping-methods-container] >> text=Standard Shipping"
    )

    await checkoutPage.checkShippingSummary("FREE")
    await checkoutPage.save("Shipping")

    await checkoutPage.checkTotalAmount("€315,00")
    await checkoutPage.setCoupon("testcoupon")
    await checkoutPage.checkCouponCode("TESTCOUPON")
    await checkoutPage.checkDiscountAmount("-€94,50")
    await checkoutPage.checkTotalAmount("€220,50")
    await checkoutPage.removeCoupon()
    await checkoutPage.checkTotalAmount("€315,00")
    await checkoutPage.setCoupon("testcoupon")
    await checkoutPage.checkTotalAmount("€220,50")

    element = await checkoutPage.page.locator("[data-cy=step_payment]")
    expect(element).toHaveAttribute("data-status", "true")
    expect(
      checkoutPage.page.locator(
        "[data-test-id=stripe_payments] >> text=Credit Card"
      )
    ).toBeVisible()
    await checkoutPage.page.click(
      "[data-test-id=stripe_payments] >> text=Credit card",
      { force: true }
    )
    await checkoutPage.checkPaymentSummary("€10,00")

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")

    expect(
      checkoutPage.page.locator("text=Order successfully placed!")
    ).toBeVisible()

    element = await checkoutPage.page.locator("button >> text=Remove")
    await expect(element).toHaveCount(0)

    expect(
      checkoutPage.page.locator(
        "[data-cy=payment-recap] >> text=Visa ending in 4242"
      )
    ).toBeVisible()
  })
})
