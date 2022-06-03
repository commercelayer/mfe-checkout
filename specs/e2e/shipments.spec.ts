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

    await checkoutPage.page.waitForTimeout(1000)

    await checkoutPage.selectShippingMethod({
      text: "Standard Shipping",
      shipment: 1,
    })
    await checkoutPage.page.waitForTimeout(1000)

    await checkoutPage.save("Shipping")
    await checkoutPage.page.waitForTimeout(1000)

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
    await checkoutPage.page.waitForTimeout(1000)

    await checkoutPage.clickStep("Shipping")
    await checkoutPage.page.waitForTimeout(1000)

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
    await checkoutPage.page.waitForTimeout(1000)

    await checkoutPage.selectShippingMethod({
      text: "Standard Shipping",
      shipment: 1,
    })
    await checkoutPage.page.waitForTimeout(1000)

    await checkoutPage.save("Shipping")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")
    await checkoutPage.clickStep("Shipping")
    await checkoutPage.page.waitForTimeout(1000)

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
    await checkoutPage.page.waitForTimeout(1000)
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

    await checkoutPage.checkShippingMethodPrice({ text: "Free" })

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

    await checkoutPage.checkShippingMethodPrice({ index: 1, text: "€12,00" })

    const element = checkoutPage.page.locator(
      '[data-test-id="shipping-method-price"] >> nth=1 >> text=€12,00'
    )

    await expect(element).toHaveCount(1)

    await checkoutPage.selectShippingMethod({
      text: "Express Delivery",
    })

    await checkoutPage.save("Shipping")
    await checkoutPage.checkShippingSummary("€12,00")
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
    await checkoutPage.page.waitForTimeout(1000)

    const element = await checkoutPage.page.locator(
      "[ data-test-id=save-shipping-button]"
    )
    await expect(element).toBeEnabled()
    await checkoutPage.save("Shipping")
    await checkoutPage.page.waitForTimeout(1000)

    await checkoutPage.clickStep("Shipping")
    await checkoutPage.page.waitForTimeout(1000)

    await checkoutPage.checkSelectedShippingMethod({ index: 0, value: true })
    await checkoutPage.checkSelectedShippingMethod({ index: 1, value: false })
    await checkoutPage.selectShippingMethod({ text: "Express Delivery" })
    await checkoutPage.page.waitForTimeout(1000)
    await checkoutPage.save("Shipping")
    await checkoutPage.clickStep("Shipping")
    await checkoutPage.page.waitForTimeout(1000)
    await checkoutPage.checkSelectedShippingMethod({ index: 0, value: false })
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
    await checkoutPage.selectPayment("stripe")

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")
  })
})

test.describe("with single shipping method, not shippable", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      market: process.env.NEXT_PUBLIC_MARKET_ID_SINGLE_SHIPPING_METHOD,
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

test.describe("with single shipping method per shipment", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      market: process.env.NEXT_PUBLIC_MARKET_ID_SINGLE_SHIPPING_METHOD,
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
          billing_info: faker.random.alphaNumeric(11),
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

test.describe("with do no track SKU", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "SOCKXXMUFFFFFF000000MXXX", quantity: 2 },
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
  })
})

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
          billing_info: faker.random.alphaNumeric(11),
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

test.describe(
  "one item shippable and one item out of stock with cartUrl",
  () => {
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
  }
)

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
          billing_info: faker.random.alphaNumeric(11),
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

test.describe("ship from primary", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      market: process.env.NEXT_PUBLIC_MARKET_ID_SHIP_FROM_PRIMARY,
      lineItemsAttributes: [
        { sku_code: "LSLEEVMM000000E63E74LXXX", quantity: 1 },
        { sku_code: "PSTBIGAU000000FFFFFF1824", quantity: 1 },
      ],
      orderAttributes: {
        customer_email: customerEmail,
      },
    },
  })

  test("can see both article in delivery step", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    const { billing_info, ...address } = euAddress
    await checkoutPage.setBillingAddress(address)
    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "open")
    const element = checkoutPage.page.locator('[data-test-id="line-item-name"]')
    await expect(element).toHaveCount(2)
  })
})

test.describe("ship from primary with all stock transfers", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      market: process.env.NEXT_PUBLIC_MARKET_ID_SHIP_FROM_PRIMARY,
      lineItemsAttributes: [
        { sku_code: "BABYONBU000000E63E7412MX", quantity: 1 },
        { sku_code: "PSTBIGAU000000FFFFFF1824", quantity: 1 },
        { sku_code: "NOIMAGE", quantity: 1 },
      ],
      orderAttributes: {
        customer_email: customerEmail,
      },
    },
  })

  test("can see both article in delivery step", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    const { billing_info, ...address } = euAddress
    await checkoutPage.setBillingAddress(address)
    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "open")
    const element = checkoutPage.page.locator('[data-test-id="line-item-name"]')

    await expect(element).toHaveCount(3)
  })
})

test.describe("discount with coupon", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      market: process.env.NEXT_PUBLIC_MARKET_ID_SHIP_FROM_PRIMARY,
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

    const { billing_info, ...address } = euAddress
    await checkoutPage.setBillingAddress(address)
    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "open")
    await checkoutPage.selectShippingMethod({ text: "Express Delivery" })
    await checkoutPage.page.waitForTimeout(1000)
    await checkoutPage.checkShippingSummary("Free")
    await checkoutPage.setCoupon("test50off")
    await checkoutPage.page.waitForTimeout(1000)
    await checkoutPage.checkShippingSummary("To be calculated")
    await checkoutPage.page.waitForTimeout(1000)
    await checkoutPage.selectShippingMethod({ text: "Express Delivery" })
    await checkoutPage.page.waitForTimeout(1000)
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
    await checkoutPage.page.waitForTimeout(1000)
    await checkoutPage.checkButton({ type: "Shipping", status: "disabled" })
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
