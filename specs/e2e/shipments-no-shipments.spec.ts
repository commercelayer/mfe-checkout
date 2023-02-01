import { faker } from "@faker-js/faker"

import { test, expect } from "../fixtures/tokenizedPage"
import { euAddress } from "../utils/addresses"

const customerEmail = faker.internet.email().toLocaleLowerCase()

const TIMEOUT = 1000

test.describe("with one shipment (do not ship)", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "SWEETHMUB7B7B7E63E74MXXX", quantity: 1 },
      ],
      orderAttributes: {
        customer_email: customerEmail,
      },
      addresses: {
        billingAddress: euAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("no shipping step", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkCustomerEmail(customerEmail)

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "not_present")

    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.checkBadgeIndex("Payment", "2")
  })
})

test.describe("with two shipment (one do not ship)", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "SWEETHMUB7B7B7E63E74MXXX", quantity: 1 },
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      orderAttributes: {
        customer_email: customerEmail,
      },
      addresses: {
        billingAddress: euAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("no shipping step", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkCustomerEmail(customerEmail)

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.checkBadgeIndex("Shipping", "2")
    await checkoutPage.checkBadgeIndex("Payment", "3")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    const element = await checkoutPage.page.locator(
      "[ data-testid=save-shipping-button]"
    )
    await expect(element).toBeEnabled()
    await checkoutPage.save("Shipping")
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.clickStep("Shipping")
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.checkSelectedShippingMethod({ index: 0, value: true })
    await checkoutPage.checkSelectedShippingMethod({ index: 1, value: false })
    await checkoutPage.selectShippingMethod({ text: "Express Delivery" })
    await checkoutPage.page.waitForTimeout(TIMEOUT)
    await checkoutPage.save("Shipping")
    await checkoutPage.clickStep("Shipping")
    await checkoutPage.page.waitForTimeout(TIMEOUT)
    await checkoutPage.checkSelectedShippingMethod({ index: 0, value: false })
    await checkoutPage.checkSelectedShippingMethod({ index: 1, value: true })
  })
})
