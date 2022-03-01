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
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()
    await checkoutPage.setCustomerMail("customer@tk.com")
    await checkoutPage.setBillingAddress()
    let element = await checkoutPage.page.locator("[data-cy=step_customer]")
    expect(element).toHaveAttribute("data-status", "true")
    await checkoutPage.continue("Customer")

    element = await checkoutPage.page.locator("[data-cy=step_shipping]")
    expect(element).toHaveAttribute("data-status", "true")

    await checkoutPage.checkShippingSummary("To be calculated")
    expect(checkoutPage.page.locator("text=Standard Shipping")).toBeVisible()
    await checkoutPage.page.click(
      "[data-cy=shipping-methods-container] >> text=Standard Shipping"
    )

    await checkoutPage.checkShippingSummary("FREE")
    await checkoutPage.continue("Shipping")

    element = await checkoutPage.page.locator("[data-cy=step_payment]")
    expect(element).toHaveAttribute("data-status", "false")

    element = await checkoutPage.page.locator(
      "[data-cy=step-header-info] >> text=This order does not require payment"
    )

    expect(element).toBeVisible()

    await checkoutPage.continue("Payment")

    expect(
      checkoutPage.page.locator("text=Order successfully placed!")
    ).toBeVisible()

    expect(
      checkoutPage.page.locator(
        "[data-cy=payment-recap] >> text=This order did not require a payment"
      )
    ).toBeVisible()
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
      },
    },
  })

  test("should execute a free checkout with no shipments", async ({
    checkoutPage,
  }) => {
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()
    await checkoutPage.setCustomerMail("customer@tk.com")
    await checkoutPage.setBillingAddress()
    let element = await checkoutPage.page.locator("[data-cy=step_customer]")
    expect(element).toHaveAttribute("data-status", "true")
    await checkoutPage.continue("Customer")

    element = await checkoutPage.page.locator("[data-cy=step_shipping]")
    expect(element).toHaveCount(0)

    element = await checkoutPage.page.locator("[data-cy=shipping-amount]")
    expect(element).toHaveCount(0)

    element = await checkoutPage.page.locator("[data-cy=step_payment]")
    expect(element).toHaveAttribute("data-status", "false")

    element = await checkoutPage.page.locator(
      "[data-cy=step-header-info] >> text=This order does not require payment"
    )

    expect(element).toBeVisible()

    await checkoutPage.continue("Payment")

    expect(
      checkoutPage.page.locator("text=Order successfully placed!")
    ).toBeVisible()

    expect(
      checkoutPage.page.locator(
        "[data-cy=payment-recap] >> text=This order did not require a payment"
      )
    ).toBeVisible()
  })
})
