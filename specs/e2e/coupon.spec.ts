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
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.setCustomerMail()
    await checkoutPage.setBillingAddress()

    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.checkShippingSummary("To be calculated")

    await expect(
      checkoutPage.page.locator("text=Standard Shipping")
    ).toBeVisible()

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.checkShippingSummary("FREE")
    await checkoutPage.save("Shipping")
    await checkoutPage.checkCouponCode("TESTCOUPON")
    await checkoutPage.checkDiscountAmount("-€94,50")

    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.checkPaymentSummary("€10,00")

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")

    await checkoutPage.checkPaymentRecap("Visa ending in 4242")
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
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.setCustomerMail("customer@tk.com")
    await checkoutPage.setBillingAddress()

    await checkoutPage.checkStep("Customer", "open")
    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.checkShippingSummary("To be calculated")
    await expect(
      checkoutPage.page.locator("text=Standard Shipping")
    ).toBeVisible()
    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

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

    await checkoutPage.checkStep("Payment", "open")
    await checkoutPage.selectPayment("stripe")

    await checkoutPage.checkPaymentSummary("€10,00")

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")

    await checkoutPage.checkPaymentRecap("Visa ending in 4242")

    const element = await checkoutPage.page.locator("button >> text=Remove")
    await expect(element).toHaveCount(0)
  })
})
