import { faker } from "@faker-js/faker"

import { test, expect } from "../fixtures/tokenizedPage"
import { euAddress, usAddress } from "../utils/addresses"

const customerEmail = faker.internet.email().toLocaleLowerCase()

const TIMEOUT = 1000

test.describe("with two shipments", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
        { sku_code: "TSHIRTMMFFFFFF000000XLXX", quantity: 5 },
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

  test("select multiple options", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkCustomerEmail(customerEmail)

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.checkShippingSummary("To be calculated")

    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.selectShippingMethod({
      text: "Standard Shipping",
      shipment: 0,
    })

    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.selectShippingMethod({
      text: "Standard Shipping",
      shipment: 1,
    })
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.save("Shipping")
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.clickStep("Shipping")
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.checkSelectedShippingMethod({
      index: 0,
      shipment: 0,
      value: true,
    })
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.checkSelectedShippingMethod({
      index: 0,
      shipment: 1,
      value: true,
    })

    await checkoutPage.checkShippingSummary("FREE")

    await checkoutPage.selectShippingMethod({
      text: "Express Delivery",
      shipment: 0,
    })
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.selectShippingMethod({
      text: "Express Delivery",
      shipment: 1,
    })
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.save("Shipping")

    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.clickStep("Shipping")
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.checkSelectedShippingMethod({
      index: 1,
      shipment: 0,
      value: true,
    })
    await checkoutPage.checkSelectedShippingMethod({
      index: 1,
      shipment: 1,
      value: true,
    })
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.selectShippingMethod({
      text: "Express Delivery",
      shipment: 0,
    })
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.selectShippingMethod({
      text: "Standard Shipping",
      shipment: 1,
    })
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.save("Shipping")
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")
    await checkoutPage.clickStep("Shipping")
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.checkSelectedShippingMethod({
      index: 1,
      shipment: 0,
      value: true,
    })
    await checkoutPage.checkSelectedShippingMethod({
      index: 0,
      shipment: 1,
      value: true,
    })

    await checkoutPage.selectShippingMethod({
      text: "Express Delivery",
      shipment: 1,
    })
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.selectShippingMethod({
      text: "Standard Shipping",
      shipment: 0,
    })
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.save("Shipping")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")
    await checkoutPage.clickStep("Shipping")
    await checkoutPage.page.waitForTimeout(TIMEOUT)
    await checkoutPage.checkSelectedShippingMethod({
      index: 0,
      shipment: 0,
      value: true,
    })
    await checkoutPage.checkSelectedShippingMethod({
      index: 1,
      shipment: 1,
      value: true,
    })
  })
})

test.describe("with single shipping method per shipment", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      market: "US",
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
        { sku_code: "MUGXXXAUFFFFFF00000011OZ", quantity: 1 },
      ],
      orderAttributes: {
        customer_email: customerEmail,
      },
    },
  })

  test("different shipping methods, but single per shipment", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.setBillingAddress(usAddress)
    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkButton({ type: "Shipping", status: "not_present" })
    const element = checkoutPage.page.locator(
      "text=Your order contains 2 shipments"
    )
    await expect(element).toHaveCount(1)
    await checkoutPage.selectPayment("stripe")

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")
  })
})
