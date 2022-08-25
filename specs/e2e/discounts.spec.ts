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
    await checkoutPage.checkCouponCode("testcoupon")
    await checkoutPage.checkDiscountAmount("-€94,50")

    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.checkPaymentSummary("€10,00")

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")

    await checkoutPage.checkPaymentRecap("Visa ending in 4242")
  })

  test("should execute a checkout removing coupon", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.setCustomerMail()
    await checkoutPage.setBillingAddress()

    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.checkCouponCode("testcoupon")
    await checkoutPage.checkDiscountAmount("-€94,50")

    await checkoutPage.removeCoupon()
    await checkoutPage.checkDiscountAmount(undefined)

    await checkoutPage.page.waitForTimeout(1000)

    await checkoutPage.checkShippingSummary("To be calculated")

    await expect(
      checkoutPage.page.locator("text=Standard Shipping")
    ).toBeVisible()

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.checkShippingSummary("FREE")

    await checkoutPage.save("Shipping")

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

  test("should execute a checkout with coupon", async ({ checkoutPage }) => {
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
    await checkoutPage.checkCouponCode("testcoupon")
    await checkoutPage.checkDiscountAmount("-€94,50")
    await checkoutPage.checkTotalAmount("€220,50")
    await checkoutPage.removeCoupon()
    await checkoutPage.checkTotalAmount("€315,00")
    await checkoutPage.setCoupon("testcoupon")
    await checkoutPage.checkTotalAmount("€220,50")
    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.checkShippingSummary("FREE")
    await checkoutPage.save("Shipping")

    await checkoutPage.checkStep("Payment", "open")
    await checkoutPage.selectPayment("stripe")

    await checkoutPage.checkPaymentSummary("€10,00")

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")

    await checkoutPage.checkPaymentRecap("Visa ending in 4242")

    const element = await checkoutPage.page.locator("button >> text=Remove")
    await expect(element).toHaveCount(0)
  })

  test("should not apply after removing and click apply", async ({
    checkoutPage,
  }) => {
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
    await checkoutPage.checkCouponCode("testcoupon")
    await checkoutPage.checkDiscountAmount("-€94,50")
    await checkoutPage.checkTotalAmount("€220,50")
    await checkoutPage.removeCoupon()
    await checkoutPage.checkTotalAmount("€315,00")
    await checkoutPage.setCoupon("")
    await checkoutPage.page.waitForTimeout(2000)
    await checkoutPage.checkTotalAmount("€315,00")
  })
})

test.describe("without applied coupon code", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "SWEETSMUB7B7B7E63E74LXXX", quantity: 9 },
      ],
    },
  })

  test("checkout with valid coupon", async ({ checkoutPage }) => {
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
    await checkoutPage.checkCouponCode("testcoupon")
    await checkoutPage.checkDiscountAmount("-€94,50")
    await checkoutPage.checkTotalAmount("€220,50")
    await checkoutPage.removeCoupon()
    await checkoutPage.checkTotalAmount("€315,00")
    await checkoutPage.setCoupon("testcoupon")
    await checkoutPage.checkTotalAmount("€220,50")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.checkShippingSummary("FREE")
    await checkoutPage.save("Shipping")
    await checkoutPage.checkStep("Payment", "open")
    await checkoutPage.selectPayment("stripe")

    await checkoutPage.checkPaymentSummary("€10,00")

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")

    await checkoutPage.checkPaymentRecap("Visa ending in 4242")

    const element = await checkoutPage.page.locator("button >> text=Remove")
    await expect(element).toHaveCount(0)
  })

  test("error with invalid coupon", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.setCoupon("wrongcoupon")

    await checkoutPage.checkCouponError(
      "Please enter a valid gift card or coupon"
    )

    await checkoutPage.setCoupon("testcoupon")

    await checkoutPage.checkCouponCode("testcoupon")
    await checkoutPage.checkCouponError(undefined)
  })
})

test.describe("with giftcard", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "TSHIRTMMFFFFFF000000XLXX", quantity: 5 },
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      giftCardAttributes: {
        balance_cents: 10000,
        apply: true,
      },
    },
  })

  test("should execute a checkout", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    await checkoutPage.setCustomerMail("customer@tk.com")

    await checkoutPage.setBillingAddress()
    await checkoutPage.checkStep("Customer", "open")
    await checkoutPage.save("Customer")

    await checkoutPage.checkGiftCardAmount("-€100,00")
    await checkoutPage.checkTotalAmount("€144,00")
    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.checkShippingSummary("To be calculated")
    await checkoutPage.checkTaxSummary("To be calculated")

    expect(
      checkoutPage.page.locator("text=Standard Shipping >> nth=0")
    ).toBeVisible()
    expect(
      checkoutPage.page.locator("text=Standard Shipping >> nth=1")
    ).toBeVisible()

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.checkShippingSummary("To be calculated")

    await checkoutPage.selectShippingMethod({
      text: "Standard Shipping",
      shipment: 1,
    })

    await checkoutPage.checkShippingSummary("FREE")
    await checkoutPage.save("Shipping")

    await checkoutPage.checkStep("Payment", "open")
    await checkoutPage.selectPayment("stripe")

    await checkoutPage.checkPaymentSummary("€10,00")

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")

    const element = await checkoutPage.page.locator("button >> text=Remove")
    await expect(element).toHaveCount(0)
    await checkoutPage.checkPaymentRecap("Visa ending in 4242")
  })

  test("error with invalid coupon", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.setCoupon("wrongcoupon")

    await checkoutPage.checkCouponError("Please enter a valid coupon.")

    await checkoutPage.setCoupon("testcoupon")

    await checkoutPage.checkCouponCode("testcoupon")
    await checkoutPage.checkCouponError(undefined)
  })
})

test.describe("without applied giftcard", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "TSHIRTMMFFFFFF000000XLXX", quantity: 5 },
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      giftCardAttributes: {
        balance_cents: 10000,
        apply: false,
      },
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
    expect(
      checkoutPage.page.locator("text=Standard Shipping >> nth=0")
    ).toBeVisible()
    expect(
      checkoutPage.page.locator("text=Standard Shipping >> nth=1")
    ).toBeVisible()
    await checkoutPage.selectShippingMethod({
      text: "Standard Shipping",
      shipment: 0,
    })

    await checkoutPage.checkShippingSummary("To be calculated")

    await checkoutPage.selectShippingMethod({
      text: "Standard Shipping",
      shipment: 1,
    })

    await checkoutPage.checkShippingSummary("FREE")
    await checkoutPage.save("Shipping")

    await checkoutPage.checkTotalAmount("244,00")
    await checkoutPage.setCoupon(checkoutPage.getGiftCard() as string)

    await checkoutPage.checkGiftCardAmount("-€100,00")
    await checkoutPage.checkTotalAmount("€144,00")
    await checkoutPage.removeGiftCard()
    await checkoutPage.checkTotalAmount("€244,00")
    await checkoutPage.setCoupon(checkoutPage.getGiftCard() as string)
    await checkoutPage.checkTotalAmount("€144,00")
    await checkoutPage.checkStep("Payment", "open")
    await checkoutPage.selectPayment("stripe")

    await checkoutPage.checkPaymentSummary("€10,00")

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")
    await checkoutPage.checkPaymentRecap("Visa ending in 4242")
  })

  test("error with invalid giftcard", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.setCoupon("wronggiftcard")

    await checkoutPage.page.waitForTimeout(1000)

    await checkoutPage.checkCouponError(
      "Please enter a valid gift card or coupon"
    )

    await checkoutPage.setCoupon("testcoupon")
    await checkoutPage.page.waitForTimeout(1000)

    await checkoutPage.checkCouponError(undefined)
    await checkoutPage.page.waitForTimeout(1000)

    await checkoutPage.setCoupon("wronggiftcard")
    await checkoutPage.page.waitForTimeout(1000)

    await checkoutPage.checkCouponError("Please enter a valid gift card")

    await checkoutPage.setCoupon(checkoutPage.getGiftCard() as string)
    await checkoutPage.page.waitForTimeout(1000)

    await checkoutPage.checkCouponError(undefined)

    await checkoutPage.checkCouponCode("testcoupon")
    await checkoutPage.checkGiftCardCode(checkoutPage.getGiftCard() as string)
  })
})
