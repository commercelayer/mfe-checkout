import { faker } from "@faker-js/faker"

import { test, expect } from "../fixtures/tokenizedPage"
import { euAddress } from "../utils/addresses"

test.describe("with return url", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()

  const returnUrl = "https://www.google.it"
  test.use({
    defaultParams: {
      order: "with-items",
      orderAttributes: {
        return_url: returnUrl,
        customer_email: customerEmail,
      },
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      addresses: {
        billingAddress: euAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("link in thankyou page", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")
    await checkoutPage.checkPaymentRecap("Visa ending in 4242")

    await checkoutPage.checkContinueShoppingLink("present")

    await checkoutPage.clickContinueShoppingLink()

    const url = await checkoutPage.page.url()

    await expect(url).toMatch(returnUrl)
  })
})

test.describe("without return url", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()

  test.use({
    defaultParams: {
      order: "with-items",
      orderAttributes: {
        customer_email: customerEmail,
      },
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      addresses: {
        billingAddress: euAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("no link", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")
    await checkoutPage.checkPaymentRecap("Visa ending in 4242")

    await checkoutPage.checkContinueShoppingLink("not_present")
  })
})

test.describe("with support phone and email", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()
  const phone = faker.phone.number()
  const email = faker.internet.email()
  const returnUrl = "https://www.google.it"

  test.use({
    defaultParams: {
      order: "with-items",
      organization: {
        support_phone: phone,
        support_email: email,
      },
      orderAttributes: {
        customer_email: customerEmail,
        return_url: returnUrl,
      },
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      addresses: {
        billingAddress: euAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("all present", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("wire")

    await checkoutPage.save("Payment")

    await checkoutPage.checkContinueShoppingLink("present")
    let element = checkoutPage.page.locator(`text=${phone}`)
    await expect(element).toHaveCount(1)
    await element.click({ trial: true })
    element = checkoutPage.page.locator(`text=${email}`)
    await expect(element).toHaveCount(1)
    await element.click({ trial: true })
  })
})

test.describe("with support phone", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()
  const phone = faker.phone.number()
  const returnUrl = "https://www.google.it"

  test.use({
    defaultParams: {
      order: "with-items",
      organization: {
        support_phone: phone,
      },
      orderAttributes: {
        customer_email: customerEmail,
        return_url: returnUrl,
      },
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      addresses: {
        billingAddress: euAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("only phone", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("wire")

    await checkoutPage.save("Payment")

    await checkoutPage.checkContinueShoppingLink("present")
    let element = checkoutPage.page.locator("[data-test-id=support-phone-link]")
    await expect(element).toHaveCount(1)
    await element.click({ trial: true })

    element = checkoutPage.page.locator("[data-test-id=support-email-link]")
    await expect(element).toHaveCount(0)
  })
})

test.describe("with support email", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()
  const email = faker.internet.email()
  const returnUrl = "https://www.google.it"

  test.use({
    defaultParams: {
      order: "with-items",
      organization: {
        support_email: email,
      },
      orderAttributes: {
        customer_email: customerEmail,
        return_url: returnUrl,
      },
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      addresses: {
        billingAddress: euAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("only email", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("wire")

    await checkoutPage.save("Payment")

    await checkoutPage.checkContinueShoppingLink("present")
    let element = checkoutPage.page.locator("[data-test-id=support-phone-link]")
    await expect(element).toHaveCount(0)
    element = checkoutPage.page.locator("[data-test-id=support-email-link]")
    await expect(element).toHaveCount(1)
    await element.click({ trial: true })
  })
})
