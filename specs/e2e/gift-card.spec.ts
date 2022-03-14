import { test, expect } from "../fixtures/tokenizedPage"

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
})

test.describe("without coupon code", () => {
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
})
