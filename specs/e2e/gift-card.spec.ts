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
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()
    await checkoutPage.setCustomerMail("customer@tk.com")

    await checkoutPage.setBillingAddress()
    let element = await checkoutPage.page.locator("[data-cy=step_customer]")
    expect(element).toHaveAttribute("data-status", "true")
    await checkoutPage.continue("Customer")

    await checkoutPage.checkGiftCardAmount("-€100,00")
    await checkoutPage.checkTotalAmount("€144,00")

    element = await checkoutPage.page.locator("[data-cy=step_shipping]")
    expect(element).toHaveAttribute("data-status", "true")

    await checkoutPage.checkShippingSummary("To be calculated")
    await checkoutPage.checkTaxSummary("To be calculated")

    expect(
      checkoutPage.page.locator("text=Standard Shipping >> nth=0")
    ).toBeVisible()
    expect(
      checkoutPage.page.locator("text=Standard Shipping >> nth=1")
    ).toBeVisible()
    await checkoutPage.page.click(
      "[data-cy=shipping-methods-container] >> text=Standard Shipping >> nth=0"
    )

    await checkoutPage.checkShippingSummary("To be calculated")

    await checkoutPage.page.click(
      "[data-cy=shipping-methods-container] >> text=Standard Shipping >> nth=1"
    )

    await checkoutPage.checkShippingSummary("FREE")
    await checkoutPage.continue("Shipping")

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

    await checkoutPage.continue("Payment")

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
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()
    await checkoutPage.setCustomerMail("customer@tk.com")
    await checkoutPage.setBillingAddress()
    let element = await checkoutPage.page.locator("[data-cy=step_customer]")
    expect(element).toHaveAttribute("data-status", "true")
    await checkoutPage.continue("Customer")

    element = await checkoutPage.page.locator("[data-cy=step_shipping]")
    expect(element).toHaveAttribute("data-status", "true")

    await checkoutPage.checkShippingSummary("To be calculated")
    expect(
      checkoutPage.page.locator("text=Standard Shipping >> nth=0")
    ).toBeVisible()
    expect(
      checkoutPage.page.locator("text=Standard Shipping >> nth=1")
    ).toBeVisible()
    await checkoutPage.page.click(
      "[data-cy=shipping-methods-container] >> text=Standard Shipping >> nth=0"
    )

    await checkoutPage.checkShippingSummary("To be calculated")

    await checkoutPage.page.click(
      "[data-cy=shipping-methods-container] >> text=Standard Shipping >> nth=1"
    )

    await checkoutPage.checkShippingSummary("FREE")
    await checkoutPage.continue("Shipping")

    await checkoutPage.checkTotalAmount("244,00")
    await checkoutPage.setCoupon(checkoutPage.getGiftCard() as string)

    await checkoutPage.checkGiftCardAmount("-€100,00")
    await checkoutPage.checkTotalAmount("€144,00")
    await checkoutPage.removeGiftCard()
    await checkoutPage.checkTotalAmount("€244,00")
    await checkoutPage.setCoupon(checkoutPage.getGiftCard() as string)
    await checkoutPage.checkTotalAmount("€144,00")

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

    await checkoutPage.continue("Payment")

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
