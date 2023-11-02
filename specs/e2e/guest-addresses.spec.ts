import { faker } from "@faker-js/faker"

import { test, expect } from "../fixtures/tokenizedPage"
import { euAddress, euAddress2 } from "../utils/addresses"

const customerEmail = faker.internet.email().toLocaleLowerCase()

test.describe("with customer email", () => {
  test.use({
    defaultParams: {
      order: "plain",
      orderAttributes: {
        customer_email: customerEmail,
      },
    },
  })

  test("Checkout guest address", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    const email = await checkoutPage.getCustomerMail()

    await expect(email).toHaveValue(customerEmail)

    await checkoutPage.setCustomerMail("customer@example.com")
    await checkoutPage.blurCustomerEmail()

    await checkoutPage.setBillingAddress()
    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.save("Customer")

    await checkoutPage.checkCustomerEmail("customer@example.com")
    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkBillingAddress(euAddress)

    await checkoutPage.shipToDifferentAddress()

    await checkoutPage.checkShipToDifferentAddressValue(true)

    await checkoutPage.setShippingAddress()

    await checkoutPage.save("Customer")

    await checkoutPage.clickStep("Customer")
    await checkoutPage.checkBillingAddress(euAddress)
    await checkoutPage.checkShippingAddress(euAddress2)
  })

  test("missing fields on billing address", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    const { name, address } = faker

    const newAddress = {
      first_name: name.firstName(),
      last_name: name.lastName(),
      line_1: address.streetAddress(),
    }
    await checkoutPage.setBillingAddress(newAddress)

    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.checkButton({ type: "Customer", status: "disabled" })

    await checkoutPage.setBillingAddress({ ...euAddress, ...newAddress })
    await checkoutPage.checkButton({ type: "Customer", status: "enabled" })
  })

  test("line_2 optional attribute on billing address", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.setBillingAddress({ ...euAddress, line_2: "" })
    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.checkButton({ type: "Customer", status: "enabled" })

    await checkoutPage.setBillingAddress({ ...euAddress })

    await checkoutPage.checkButton({ type: "Customer", status: "enabled" })

    await checkoutPage.setBillingAddress({ ...euAddress, line_2: "" })

    await checkoutPage.checkButton({ type: "Customer", status: "enabled" })

    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkBillingAddress({ ...euAddress, line_2: "" })
  })

  test("line_2 optional attribute on shipping address", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.setBillingAddress({ ...euAddress })
    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.checkButton({ type: "Customer", status: "enabled" })

    await checkoutPage.shipToDifferentAddress()

    await checkoutPage.setShippingAddress({ ...euAddress2 })

    await checkoutPage.checkButton({ type: "Customer", status: "enabled" })

    await checkoutPage.setShippingAddress({ ...euAddress2, line_2: "" })

    await checkoutPage.checkButton({ type: "Customer", status: "enabled" })

    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkShippingAddress({ ...euAddress2, line_2: "" })
  })
})

test.describe("with customer email and same addresses", () => {
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

  test("Checkout guest address", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkCustomerEmail(customerEmail)
    await checkoutPage.checkStep("Customer", "close")

    await checkoutPage.clickStep("Customer")
    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.checkBillingAddress(euAddress)

    await checkoutPage.checkShipToDifferentAddressValue(false)
  })
})

test.describe("with customer email and different addresses", () => {
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
        shippingAddress: euAddress2,
      },
    },
  })

  test("Checkout guest address", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkCustomerEmail(customerEmail)
    await checkoutPage.checkStep("Customer", "close")

    await checkoutPage.clickStep("Customer")
    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.checkBillingAddress(euAddress)

    await checkoutPage.checkShipToDifferentAddressValue(true)

    await checkoutPage.checkShippingAddress(euAddress2)
  })
})

test.describe("with customer email and shipping country code lock", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      orderAttributes: {
        customer_email: customerEmail,
        shipping_country_code_lock: "IT",
      },
    },
  })

  test("Checkout guest address", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    let email = await checkoutPage.getCustomerMail()

    await expect(email).toHaveValue(customerEmail)

    await checkoutPage.changeCustomerEmail("customer@example.com")
    await checkoutPage.blurCustomerEmail()
    email = await checkoutPage.getCustomerMail()

    await expect(email).toHaveValue("customer@example.com")
    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.setBillingAddress()

    await checkoutPage.save("Customer")
    await checkoutPage.checkStep("Customer", "close")

    await checkoutPage.checkCustomerEmail("customer@example.com")

    await checkoutPage.clickStep("Customer")
    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.checkBillingAddress(euAddress)

    await checkoutPage.checkShipToDifferentAddressValue(false)
    await checkoutPage.checkShipToDifferentAddressEnabled(true)

    await checkoutPage.selectCountry("billing_address", "FR")

    await checkoutPage.checkShipToDifferentAddressValue(true)
    await checkoutPage.checkShipToDifferentAddressEnabled(false)

    const element = await checkoutPage.page.locator(
      "[data-testid=input_shipping_address_country_code]"
    )
    expect(element).toBeDisabled()
    const shippingAddress = {
      ...euAddress,
      first_name: "Matteo",
      last_name: "Rossi",
      state_code: "FI",
    }

    await checkoutPage.setShippingAddress(shippingAddress)

    await checkoutPage.save("Customer")

    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkBillingAddress({ ...euAddress, country_code: "FR" })
    await checkoutPage.checkShippingAddress(shippingAddress)
  })
})

test.describe("with digital product and shipping country code lock", () => {
  test.use({
    defaultParams: {
      order: "digital",
      orderAttributes: {
        customer_email: customerEmail,
        shipping_country_code_lock: "IT",
      },
    },
  })

  test("Checkout different country code address", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    const email = await checkoutPage.getCustomerMail()

    await expect(email).toHaveValue(customerEmail)

    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.setBillingAddress()

    await checkoutPage.selectCountry("billing_address", "FR")
    await checkoutPage.page.fill(
      "[data-testid=input_billing_address_state_code]",
      "PA"
    )

    await checkoutPage.isVisibleShipToDifferentAddress(false)

    await checkoutPage.checkButton({ type: "Customer", status: "enabled" })

    await checkoutPage.save("Customer")
    await checkoutPage.checkStep("Customer", "close")

    await checkoutPage.page.reload()

    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")
    await checkoutPage.checkPaymentRecap("Visa ending in 4242")
  })
})

test.describe("with shipping country code lock and different address", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      orderAttributes: {
        customer_email: customerEmail,
        shipping_country_code_lock: "IT",
      },
      addresses: {
        billingAddress: euAddress2,
        shippingAddress: euAddress,
      },
    },
  })

  test("Checkout guest address", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkCustomerEmail(customerEmail)

    await checkoutPage.checkStep("Customer", "close")

    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkBillingAddress(euAddress2)
    await checkoutPage.checkShippingAddress(euAddress)

    await checkoutPage.checkShipToDifferentAddressValue(true)
    await checkoutPage.checkShipToDifferentAddressEnabled(false)
  })
})

test.describe("without customer email and same addresses", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      addresses: {
        billingAddress: euAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("check initial step", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    const email = await checkoutPage.getCustomerMail()
    await expect(email).toBeEmpty()
    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.checkBillingAddress(euAddress)
  })

  test("checkout rebuild shipments on guest address change", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()

    const email = await checkoutPage.getCustomerMail()
    await expect(email).toBeEmpty()
    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.setCustomerMail()
    await checkoutPage.blurCustomerEmail()

    await checkoutPage.checkBillingAddress(euAddress)

    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.clickStep("Customer")

    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "open")
  })
})

test.describe("email error validation", () => {
  test("check initial step", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    let element = checkoutPage.page.locator("[data-testid=discount-error]")
    await expect(element).toHaveCount(0)
    await checkoutPage.setCustomerMail(customerEmail)
    await checkoutPage.blurCustomerEmail()
    await expect(element).toHaveCount(0)

    await checkoutPage.setCustomerMail("")
    await checkoutPage.blurCustomerEmail()

    await checkoutPage.page
      .locator("[data-testid=customer_email_error] >> text=Can't be blank")
      .waitFor({ state: "visible" })
    element = checkoutPage.page.locator("[data-testid=discount-error]")
    await expect(element).toBeEmpty()
  })
})
