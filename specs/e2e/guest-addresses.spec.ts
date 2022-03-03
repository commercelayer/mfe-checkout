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
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()
    const email = await checkoutPage.getCustomerMail()

    await expect(email).toHaveValue(customerEmail)

    await checkoutPage.setCustomerMail("customer@example.com")
    await checkoutPage.blurCustomerEmail()
    // email = await checkoutPage.getCustomerMail()
    // await expect(email).toHaveValue(customerEmail)

    await checkoutPage.setBillingAddress()

    let element = await checkoutPage.page.locator("[data-cy=step_customer]")
    expect(element).toHaveAttribute("data-status", "true")
    await checkoutPage.save("Customer")

    await checkoutPage.checkCustomerEmail("customer@example.com")

    element = await checkoutPage.page.locator("[data-cy=step_shipping]")
    expect(element).toHaveAttribute("data-status", "true")

    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkBillingAddress(euAddress)

    await checkoutPage.shipToDifferentAddress()
    element = await checkoutPage.page.locator(
      "[data-cy=button-ship-to-different-address]"
    )
    expect(element).toHaveAttribute("data-status", "true")

    await checkoutPage.setShippingAddress()

    await checkoutPage.save("Customer")

    await checkoutPage.clickStep("Customer")
    await checkoutPage.checkBillingAddress(euAddress)
    await checkoutPage.checkShippingAddress(euAddress2)
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
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()

    await checkoutPage.checkCustomerEmail(customerEmail)

    let element = await checkoutPage.page.locator("[data-cy=step_customer]")
    expect(element).toHaveAttribute("data-status", "false")
    await checkoutPage.clickStep("Customer")
    expect(element).toHaveAttribute("data-status", "true")

    await checkoutPage.checkBillingAddress(euAddress)

    element = await checkoutPage.page.locator(
      "[data-cy=button-ship-to-different-address]"
    )
    expect(element).toHaveAttribute("data-status", "false")
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
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()

    await checkoutPage.checkCustomerEmail(customerEmail)

    let element = await checkoutPage.page.locator("[data-cy=step_customer]")
    expect(element).toHaveAttribute("data-status", "false")
    await checkoutPage.clickStep("Customer")
    expect(element).toHaveAttribute("data-status", "true")

    await checkoutPage.checkBillingAddress(euAddress)

    element = await checkoutPage.page.locator(
      "[data-cy=button-ship-to-different-address]"
    )
    expect(element).toHaveAttribute("data-status", "true")

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
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()
    let email = await checkoutPage.getCustomerMail()

    await expect(email).toHaveValue(customerEmail)

    await checkoutPage.changeCustomerEmail("customer@example.com")
    await checkoutPage.blurCustomerEmail()
    email = await checkoutPage.getCustomerMail()

    await expect(email).toHaveValue("customer@example.com")

    let element = await checkoutPage.page.locator("[data-cy=step_customer]")
    expect(element).toHaveAttribute("data-status", "true")

    await checkoutPage.setBillingAddress()

    await checkoutPage.save("Customer")

    expect(element).toHaveAttribute("data-status", "false")

    await checkoutPage.checkCustomerEmail("customer@example.com")

    await checkoutPage.clickStep("Customer")
    expect(element).toHaveAttribute("data-status", "true")

    await checkoutPage.checkBillingAddress(euAddress)

    element = await checkoutPage.page.locator(
      "[data-cy=button-ship-to-different-address]"
    )

    expect(element).toHaveAttribute("data-status", "false")
    expect(element).toBeEnabled()

    await checkoutPage.selectCountry("billing_address", "FR")

    element = await checkoutPage.page.locator(
      "[data-cy=button-ship-to-different-address]"
    )

    expect(element).toHaveAttribute("data-status", "true")
    expect(element).toBeDisabled()

    element = await checkoutPage.page.locator(
      "[data-cy=input_shipping_address_country_code]"
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
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()
    await checkoutPage.checkCustomerEmail(customerEmail)

    let element = await checkoutPage.page.locator("[data-cy=step_customer]")
    expect(element).toHaveAttribute("data-status", "false")

    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkBillingAddress(euAddress2)
    await checkoutPage.checkShippingAddress(euAddress)

    element = await checkoutPage.page.locator(
      "[data-cy=button-ship-to-different-address]"
    )

    expect(element).toHaveAttribute("data-status", "true")
    expect(element).toBeDisabled()
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
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()

    const email = await checkoutPage.getCustomerMail()
    await expect(email).toBeEmpty()
    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.checkBillingAddress(euAddress)
  })

  test("checkout rebuild shipments on guest address change", async ({
    checkoutPage,
  }) => {
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()

    const email = await checkoutPage.getCustomerMail()
    await expect(email).toBeEmpty()
    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.setCustomerMail()
    await checkoutPage.blurCustomerEmail()

    await checkoutPage.checkBillingAddress(euAddress)

    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.page.click(
      "[data-cy=shipping-methods-container] >> text=Standard Shipping"
    )

    await checkoutPage.save("Shipping")

    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.clickStep("Customer")

    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "open")
  })
})
