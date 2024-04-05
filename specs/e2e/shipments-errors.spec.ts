import { faker } from "@faker-js/faker"

import { test, expect } from "../fixtures/tokenizedPage"
import { euAddress, usAddress } from "../utils/addresses"

const customerEmail = faker.internet.email().toLocaleLowerCase()

test.describe("no shipping zone with cart url", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      orderAttributes: {
        cart_url: faker.internet.url(),
        customer_email: customerEmail,
      },
      addresses: {
        billingAddress: {
          ...usAddress,
          billing_info: faker.string.alphanumeric(11),
        },
        sameShippingAddress: true,
      },
    },
  })

  test("no shipping method to select", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    await checkoutPage.checkStep("Shipping", "open")
    await checkoutPage.checkButton({ type: "Shipping", status: "not_present" })
    const element = checkoutPage.page.locator(
      "text=The entered destination is outside our shipping zone."
    )
    await expect(element).toHaveCount(1)
  })
})

test.describe("one item shippable and one item out of stock with cartUrl", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "NOSTOCK", quantity: 1, inventory: 0 },
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      orderAttributes: {
        cart_url: faker.internet.url(),
        customer_email: customerEmail,
      },
      addresses: {
        billingAddress: euAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("no shipping method to select", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    await checkoutPage.checkStep("Shipping", "open")
    await checkoutPage.checkButton({
      type: "Shipping",
      status: "not_present",
    })
    const element = checkoutPage.page.locator(
      "text=An item in your order is no longer available. Click here to edit your cart."
    )
    await expect(element).toHaveCount(1)
  })
})

test.describe("only out of stock", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [{ sku_code: "NOSTOCK", quantity: 1, inventory: 0 }],
      orderAttributes: {
        cart_url: faker.internet.url(),
        customer_email: customerEmail,
      },
      addresses: {
        billingAddress: euAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("no shipping method to select", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    await checkoutPage.checkStep("Shipping", "open")
    await checkoutPage.checkButton({ type: "Shipping", status: "not_present" })
    const element = checkoutPage.page.locator(
      "text=An item in your order is no longer available. Click here to edit your cart."
    )
    await expect(element).toHaveCount(1)
  })
})

test.describe("partial out of stock no cart_url", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [{ sku_code: "NOSTOCK", quantity: 2, inventory: 1 }],
      orderAttributes: {
        customer_email: customerEmail,
      },
      addresses: {
        billingAddress: euAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("no shipping method to select", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    await checkoutPage.checkStep("Shipping", "open")
    await checkoutPage.checkButton({ type: "Shipping", status: "not_present" })
    const element = checkoutPage.page.locator(
      "text=An item in your order is no longer available."
    )
    await expect(element).toHaveCount(1)
  })
})

test.describe("no shipping zone and one out of stock", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "NOSTOCK", quantity: 1, inventory: 0 },
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      orderAttributes: {
        cart_url: faker.internet.url(),
        customer_email: customerEmail,
      },
      addresses: {
        billingAddress: {
          ...usAddress,
          billing_info: faker.string.alphanumeric(11),
        },
        sameShippingAddress: true,
      },
    },
  })

  test("no shipping method to select", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    await checkoutPage.checkStep("Shipping", "open")
    await checkoutPage.checkButton({ type: "Shipping", status: "not_present" })
    const element = checkoutPage.page.locator(
      "text=An item in your order is no longer available. Click here to edit your cart."
    )
    await expect(element).toHaveCount(1)
  })
})

test.describe("with single shipping method, not shippable", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      market: "US",
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
        { sku_code: "SOCKXXMUE63E74FFFFFFLXXX", quantity: 1 },
      ],
      orderAttributes: {
        customer_email: customerEmail,
      },
    },
  })

  test("a shipment without available shipping methods", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.setBillingAddress(usAddress)
    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "open")
    await checkoutPage.checkButton({ type: "Shipping", status: "not_present" })
    const element = checkoutPage.page.locator(
      "text=The entered destination is outside our shipping zone."
    )
    await expect(element).toHaveCount(1)
  })
})

test.describe("no shipping zone", () => {
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
        billingAddress: {
          ...usAddress,
          billing_info: faker.string.alphanumeric(11),
        },
        sameShippingAddress: true,
      },
    },
  })

  test("no shipping method to select", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    await checkoutPage.checkStep("Shipping", "open")
    await checkoutPage.checkButton({ type: "Shipping", status: "not_present" })
    const element = checkoutPage.page.locator(
      "text=The entered destination is outside our shipping zone. Please change your shipping address or contact us for help"
    )
    await expect(element).toHaveCount(1)
  })
})
