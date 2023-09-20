import { faker } from "@faker-js/faker"

import { test } from "../fixtures/tokenizedPage"
import { euAddress } from "../utils/addresses"

const customerEmail = faker.internet.email().toLocaleLowerCase()

const TIMEOUT = 1000

test.describe("discount with coupon", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      market: "MI",
      lineItemsAttributes: [
        { sku_code: "TSHIRTMMFFFFFFE63E74MXXX", quantity: 5 },
      ],
      orderAttributes: {
        customer_email: customerEmail,
      },
    },
  })

  test("check right shipping price", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { billing_info, ...address } = euAddress
    await checkoutPage.setBillingAddress(address)
    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "open")
    await checkoutPage.selectShippingMethod({ text: "Express Delivery" })
    await checkoutPage.page.waitForTimeout(TIMEOUT)
    await checkoutPage.checkShippingSummary("Free")
    await checkoutPage.setCoupon("test50off")
    await checkoutPage.page.waitForTimeout(TIMEOUT)
    await checkoutPage.checkShippingSummary("To be calculated")
    await checkoutPage.page.waitForTimeout(TIMEOUT)
    await checkoutPage.selectShippingMethod({ text: "Express Delivery" })
    await checkoutPage.page.waitForTimeout(TIMEOUT)
    await checkoutPage.checkShippingSummary("€10,00")
  })
})

test.describe("adding coupon code", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "TSHIRTMMFFFFFFE63E74MXXX", quantity: 1 },
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

  test("on delivery step", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "open")
    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })
    await checkoutPage.checkSelectedShippingMethod({ value: true })
    await checkoutPage.checkButton({ type: "Shipping", status: "enabled" })
    await checkoutPage.setCoupon("testcoupon")
    await checkoutPage.page.waitForTimeout(TIMEOUT)
    await checkoutPage.checkButton({ type: "Shipping", status: "disabled" })
    await checkoutPage.page.waitForTimeout(TIMEOUT)
    await checkoutPage.checkSelectedShippingMethod({ value: false })
  })

  test("on payment step", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "open")
    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })
    await checkoutPage.checkSelectedShippingMethod({ value: true })
    await checkoutPage.checkButton({ type: "Shipping", status: "enabled" })
    await checkoutPage.save("Shipping")
    await checkoutPage.checkStep("Payment", "open")
    await checkoutPage.setCoupon("testcoupon")
    await checkoutPage.checkStep("Shipping", "open")
    await checkoutPage.checkSelectedShippingMethod({ value: false })
    await checkoutPage.checkButton({ type: "Shipping", status: "disabled" })
  })
})
