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
      "[data-test-id=step-header-info] >> text=This order does not require payment"
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
      "[data-test-id=step-header-info] >> text=This order does not require payment"
    )

    await expect(element).toBeVisible()

    await checkoutPage.save("Payment")
    await checkoutPage.checkPaymentRecap("This order did not require a payment")
  })
})
