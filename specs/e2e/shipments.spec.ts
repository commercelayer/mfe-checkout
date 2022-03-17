import { faker } from "@faker-js/faker"

import { test, expect } from "../fixtures/tokenizedPage"
import { euAddress, usAddress } from "../utils/addresses"

const customerEmail = faker.internet.email().toLocaleLowerCase()

test.describe("with customer email and same addresses", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "BABYONBU000000E63E7412MX", quantity: 2 },
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

  test("select shipping method", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkCustomerEmail(customerEmail)

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.checkShippingSummary("To be calculated")
    expect(checkoutPage.page.locator("text=Standard Shipping")).toBeVisible()
    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.clickStep("Shipping")

    await checkoutPage.checkSelectedShippingMethod({ value: true })

    await checkoutPage.checkShippingSummary("FREE")

    await checkoutPage.selectShippingMethod({ text: "Express Delivery" })
    await checkoutPage.checkShippingSummary("€12,00")
    await checkoutPage.save("Shipping")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")
    await checkoutPage.clickStep("Shipping")

    await checkoutPage.checkSelectedShippingMethod({ index: 1, value: true })
  })
})

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

    await checkoutPage.selectShippingMethod({
      text: "Standard Shipping",
      shipment: 0,
    })
    await checkoutPage.selectShippingMethod({
      text: "Standard Shipping",
      shipment: 1,
    })

    await checkoutPage.save("Shipping")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.clickStep("Shipping")

    await checkoutPage.checkSelectedShippingMethod({
      index: 0,
      shipment: 0,
      value: true,
    })
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
    await checkoutPage.selectShippingMethod({
      text: "Express Delivery",
      shipment: 1,
    })

    await checkoutPage.save("Shipping")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")
    await checkoutPage.clickStep("Shipping")

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

    await checkoutPage.selectShippingMethod({
      text: "Express Delivery",
      shipment: 0,
    })
    await checkoutPage.selectShippingMethod({
      text: "Standard Shipping",
      shipment: 1,
    })

    await checkoutPage.save("Shipping")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")
    await checkoutPage.clickStep("Shipping")

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
    await checkoutPage.selectShippingMethod({
      text: "Standard Shipping",
      shipment: 0,
    })

    await checkoutPage.save("Shipping")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")
    await checkoutPage.clickStep("Shipping")

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

test.describe("with two shipping method", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
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

  test("select standard option", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkCustomerEmail(customerEmail)

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({
      text: "Standard Shipping",
    })

    await checkoutPage.save("Shipping")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.clickStep("Shipping")

    await checkoutPage.checkSelectedShippingMethod({
      index: 0,
      shipment: 0,
      value: true,
    })
  })

  test("select express option", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkCustomerEmail(customerEmail)

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({
      text: "Express Delivery",
    })

    await checkoutPage.save("Shipping")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.clickStep("Shipping")

    await checkoutPage.checkSelectedShippingMethod({
      index: 1,
      shipment: 0,
      value: true,
    })
  })
})

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

    const element = await checkoutPage.page.locator(
      "[ data-test-id=save-shipping-button]"
    )
    await expect(element).toBeEnabled()
    await checkoutPage.save("Shipping")

    await checkoutPage.clickStep("Shipping")
    await checkoutPage.checkSelectedShippingMethod({ index: 0, value: true })
    await checkoutPage.selectShippingMethod({ text: "Express Delivery" })
    await checkoutPage.save("Shipping")
    await checkoutPage.clickStep("Shipping")
    await checkoutPage.checkSelectedShippingMethod({ index: 1, value: true })
  })
})

test.describe("with addresses set and single shipping method", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      market: process.env.NEXT_PUBLIC_MARKET_ID_SINGLE_SHIPPING_METHOD,
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      orderAttributes: {
        customer_email: customerEmail,
      },
      addresses: {
        billingAddress: usAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("shipping step already completed", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkCustomerEmail(customerEmail)

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")
  })
})

test.describe("with single shipping method", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      market: process.env.NEXT_PUBLIC_MARKET_ID_SINGLE_SHIPPING_METHOD,
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      orderAttributes: {
        customer_email: customerEmail,
      },
    },
  })

  test("shipping step already completed", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.setBillingAddress(usAddress)
    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.page
      .locator("text=Express Delivery")
      .waitFor({ state: "visible" })
    await checkoutPage.checkStep("Payment", "open")
  })
})

test.describe("changing order amount", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      market: process.env.NEXT_PUBLIC_MARKET_ID_SINGLE_SHIPPING_METHOD,
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 2 },
      ],
      orderAttributes: {
        customer_email: customerEmail,
      },
    },
  })

  test("applying coupon no free shipping", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.setBillingAddress(usAddress)
    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.page
      .locator("text=Express Delivery")
      .waitFor({ state: "visible" })

    await checkoutPage.checkShippingSummary("Free")

    await checkoutPage.setCoupon("40OFFDISC")

    await checkoutPage.checkStep("Shipping", "close")

    await checkoutPage.checkShippingSummary("$7.00")

    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.selectPayment("stripe")
    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")
    await checkoutPage.checkPaymentRecap("Visa ending in 4242")
  })
})
