import { faker } from "@faker-js/faker"

import { test, expect } from "../fixtures/tokenizedPage"
import { euAddress } from "../utils/addresses"

test.describe("with return to cart", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()

  const cartUrl = "https://www.google.it"
  test.use({
    defaultParams: {
      order: "with-items",
      orderAttributes: {
        cart_url: cartUrl,
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

  test("link below summary", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkReturnToCartLink("present")

    await checkoutPage.clickReturnToCartLink()

    const url = await checkoutPage.page.url()

    await expect(url).toMatch(cartUrl)
  })
})

test.describe("without return to cart", () => {
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

  test("link below summary", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkReturnToCartLink("not_present")
  })
})

test.describe("quantity and unit price", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()

  test.use({
    defaultParams: {
      order: "with-items",
      orderAttributes: {
        customer_email: customerEmail,
      },
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
        { sku_code: "TSHIRTMMFFFFFF000000XLXX", quantity: 5 },
      ],
      addresses: {
        billingAddress: euAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("link below summary", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    await checkoutPage.page.pause()
    let element = checkoutPage.page.locator(
      "[data-test-id=order-summary] >> text=Quantity: 5x"
    )
    await expect(element).toHaveText("QUANTITY: 5x €29,00")

    element = checkoutPage.page.locator(
      "[data-test-id=order-summary] >> text=Quantity: 1"
    )
    await expect(element).toHaveText("QUANTITY: 1")
  })
})

test.describe("sku options", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()
  const company = faker.company.companyName()
  const name = `${faker.name.firstName()} ${faker.name.lastName()}`

  test.use({
    defaultParams: {
      order: "with-items",
      orderAttributes: {
        customer_email: customerEmail,
      },
      lineItemsAttributes: [
        {
          sku_code: "CANVASAU000000FFFFFF1824",
          quantity: 1,
          sku_options: [
            { name: "Engraving", value: { Company: company } },
            {
              name: "Emboss",
              value: {
                Name: name,
              },
            },
          ],
        },
        {
          sku_code: "TSHIRTMMFFFFFF000000XLXX",
          quantity: 5,
          sku_options: [{ name: "Engraving", value: { Company: company } }],
        },
      ],
      addresses: {
        billingAddress: euAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("appear only on order summary", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    await checkoutPage.checkStep("Shipping", "open")

    let element = checkoutPage.page.locator(`text=Company:${company}`)
    await expect(element).toHaveCount(2)

    element = checkoutPage.page.locator(`text=Name:${name}`)
    await expect(element).toHaveCount(1)
  })
})