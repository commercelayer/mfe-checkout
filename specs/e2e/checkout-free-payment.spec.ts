import { usAddress } from "specs/utils/addresses"

import { test, expect } from "../fixtures/tokenizedPage"

test.describe("with shippable sku", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [{ sku_code: "TESLAFREE", quantity: 1 }],
    },
  })

  test("should execute a free checkout with shipment", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.setCustomerMail()

    await checkoutPage.setBillingAddress()
    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.checkShippingSummary("To be calculated")

    expect(checkoutPage.page.locator("text=Standard Shipping")).toBeVisible()
    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.checkShippingSummary("FREE")
    await checkoutPage.save("Shipping")

    await checkoutPage.checkStep("Payment", "close")

    const element = await checkoutPage.page.locator(
      "[data-testid=step-header-info] >> text=This order does not require payment"
    )

    expect(element).toBeVisible()

    await checkoutPage.save("Payment")

    await checkoutPage.checkPaymentRecap("This order did not require a payment")
  })
})

test.describe("with shippable sku single not free shipping method", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      market: "US",
      lineItemsAttributes: [{ sku_code: "TESLAFREE", quantity: 1 }],
    },
  })

  test("should execute a checkout paying shipment", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.setCustomerMail()

    await checkoutPage.setBillingAddress(usAddress)
    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "close")

    await checkoutPage.checkShippingSummary("$7.00")

    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.checkPaymentSummary("$10.00")

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")
    await checkoutPage.checkPaymentRecap("Visa ending in 4242")
  })
})

test.describe("with shippable sku single free shipping method", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      market: "US",
      lineItemsAttributes: [{ sku_code: "GIFTBABY", quantity: 1 }],
    },
  })

  test("should execute a free checkout with shipment", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.setCustomerMail()

    await checkoutPage.setBillingAddress(usAddress)
    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "close")

    await checkoutPage.checkShippingSummary("FREE")

    await checkoutPage.checkStep("Payment", "close")

    const element = await checkoutPage.page.locator(
      "[data-testid=step-header-info] >> text=This order does not require payment"
    )

    expect(element).toBeVisible()

    await checkoutPage.save("Payment")

    await checkoutPage.checkPaymentRecap("This order did not require a payment")
  })
})

test.describe("with digital sku", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [{ sku_code: "NFTEBOOK", quantity: 1 }],
      giftCardAttributes: {
        balance_cents: 1500,
        customer_email: "customer@tk.com",
        apply: true,
      },
    },
  })

  test("should execute a free checkout with no shipments", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.setCustomerMail("customer@tk.com")
    await checkoutPage.setBillingAddress()
    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "not_present")

    checkoutPage.checkShippingSummary(undefined)

    await checkoutPage.checkStep("Payment", "close")

    const element = await checkoutPage.page.locator(
      "[data-testid=step-header-info] >> text=This order does not require payment"
    )

    await expect(element).toBeVisible()

    await checkoutPage.save("Payment")
    await checkoutPage.checkPaymentRecap("This order did not require a payment")
  })
})

test.describe("with giftcard down to zero", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      giftCardAttributes: {
        balance_cents: 10000,
        apply: false,
      },
    },
  })

  test("should execute a free checkout", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    await checkoutPage.setCustomerMail("customer@tk.com")

    await checkoutPage.setCoupon(checkoutPage.getGiftCard() as string)

    await checkoutPage.setBillingAddress()
    await checkoutPage.checkStep("Customer", "open")
    await checkoutPage.save("Customer")

    await checkoutPage.checkGiftCardAmount("-€99,00")
    await checkoutPage.checkTotalAmount("€0,00")
    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.checkShippingSummary("To be calculated")
    await checkoutPage.checkTaxSummary("To be calculated")

    expect(
      checkoutPage.page.locator("text=Standard Shipping >> nth=0")
    ).toBeVisible()
    expect(
      checkoutPage.page.locator("text=Express Delivery >> nth=0")
    ).toBeVisible()

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.checkShippingSummary("FREE")
    await checkoutPage.save("Shipping")

    await checkoutPage.checkStep("Payment", "close")

    await checkoutPage.save("Payment")

    const element = await checkoutPage.page.locator("button >> text=Remove")
    await expect(element).toHaveCount(0)
    await checkoutPage.checkPaymentRecap("This order did not require a payment")
  })

  test("should set payment not required even if on payment step", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    await checkoutPage.setCustomerMail("customer@tk.com")

    await checkoutPage.setBillingAddress()
    await checkoutPage.checkStep("Customer", "open")
    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.checkShippingSummary("To be calculated")
    await checkoutPage.checkTaxSummary("To be calculated")

    expect(
      checkoutPage.page.locator("text=Standard Shipping >> nth=0")
    ).toBeVisible()
    expect(
      checkoutPage.page.locator("text=Express Delivery >> nth=0")
    ).toBeVisible()

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.checkShippingSummary("FREE")
    await checkoutPage.save("Shipping")

    await checkoutPage.checkStep("Payment", "open")
    await checkoutPage.setCoupon(checkoutPage.getGiftCard() as string)

    await checkoutPage.checkGiftCardAmount("-€99,00")
    await checkoutPage.checkTotalAmount("€0,00")

    let element = await checkoutPage.page.locator(
      "[data-testid=step-header-info] >> text=This order does not require payment"
    )

    expect(element).toBeVisible()

    await checkoutPage.save("Payment")

    element = await checkoutPage.page.locator("button >> text=Remove")
    await expect(element).toHaveCount(0)
    await checkoutPage.checkPaymentRecap("This order did not require a payment")
  })

  test("should set payment required if removing gift card on payment step", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    await checkoutPage.setCustomerMail("customer@tk.com")

    await checkoutPage.setBillingAddress()
    await checkoutPage.checkStep("Customer", "open")
    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.checkShippingSummary("To be calculated")
    await checkoutPage.checkTaxSummary("To be calculated")

    expect(
      checkoutPage.page.locator("text=Standard Shipping >> nth=0")
    ).toBeVisible()
    expect(
      checkoutPage.page.locator("text=Express Delivery >> nth=0")
    ).toBeVisible()

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.checkShippingSummary("FREE")
    await checkoutPage.save("Shipping")

    await checkoutPage.checkStep("Payment", "open")
    await checkoutPage.setCoupon(checkoutPage.getGiftCard() as string)

    await checkoutPage.checkGiftCardAmount("-€99,00")
    await checkoutPage.checkTotalAmount("€0,00")

    let element = checkoutPage.page.locator(
      "[data-testid=step-header-info] >> text=This order does not require payment"
    )

    expect(element).toBeVisible()

    await checkoutPage.removeGiftCard()

    element = checkoutPage.page.locator(
      "[data-testid=step-header-info] >> text=This order does not require payment"
    )

    expect(element).toHaveCount(0)

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.checkPaymentSummary("€10,00")

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")

    element = await checkoutPage.page.locator("button >> text=Remove")
    await expect(element).toHaveCount(0)
    await checkoutPage.checkPaymentRecap("Visa ending in 4242")
  })
})

test.describe("with coupon down to zero", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "BABYONBU000000E63E7412MX", quantity: 1 },
      ],
      couponCode: "",
    },
  })

  test("should execute a free checkout", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    await checkoutPage.setCustomerMail("customer@tk.com")

    await checkoutPage.setCoupon("test30off")

    await checkoutPage.setBillingAddress()
    await checkoutPage.checkStep("Customer", "open")
    await checkoutPage.save("Customer")

    await checkoutPage.checkDiscountAmount("-€29,00")
    await checkoutPage.checkTotalAmount("€0,00")
    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.checkShippingSummary("To be calculated")
    await checkoutPage.checkTaxSummary("To be calculated")

    expect(
      checkoutPage.page.locator("text=Standard Shipping >> nth=0")
    ).toBeVisible()
    expect(
      checkoutPage.page.locator("text=Express Delivery >> nth=0")
    ).toBeVisible()

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.checkShippingSummary("FREE")
    await checkoutPage.save("Shipping")

    await checkoutPage.checkStep("Payment", "close")

    await checkoutPage.save("Payment")

    const element = await checkoutPage.page.locator("button >> text=Remove")
    await expect(element).toHaveCount(0)
    await checkoutPage.checkPaymentRecap("This order did not require a payment")
  })
})
