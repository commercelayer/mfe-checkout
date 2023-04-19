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
      '[data-testid="shipping-method-price"] >> nth=1 >> text=€12,00'
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

test.describe("with addresses set and single shipping method", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      market: "US",
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
      market: "US",
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

test.describe("ship from primary", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      market: "MI",
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { billing_info, ...address } = euAddress
    await checkoutPage.setBillingAddress(address)
    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "open")
    const element = checkoutPage.page.locator('[data-testid="line-item-name"]')
    await expect(element).toHaveCount(2)
  })
})

test.describe("ship from primary with all stock transfers", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      market: "MI",
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { billing_info, ...address } = euAddress
    await checkoutPage.setBillingAddress(address)
    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "open")
    const element = checkoutPage.page.locator('[data-testid="line-item-name"]')

    await expect(element).toHaveCount(3)
  })
})
