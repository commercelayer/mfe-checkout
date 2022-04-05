import { faker } from "@faker-js/faker"

import { test, expect } from "../fixtures/tokenizedPage"
import { euAddress, usAddress } from "../utils/addresses"

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

    let element = checkoutPage.page.locator(
      "[data-test-id=order-summary] >> text=Quantity: 5x"
    )
    await expect(element).toHaveText("QUANTITY: 5x €29,00")

    element = checkoutPage.page.locator(
      "[data-test-id=order-summary] >> text=Quantity: 1"
    )
    await expect(element).toHaveText("QUANTITY: 1")

    await checkoutPage.checkStep("Shipping", "open")

    element = checkoutPage.page.locator(
      "[data-test-id=shipments-container] >> text=Quantity: 5"
    )
    await expect(element).toHaveText("QUANTITY: 5")

    element = checkoutPage.page.locator(
      "[data-test-id=shipments-container] >> text=Quantity: 1"
    )
    await expect(element).toHaveText("QUANTITY: 1")
  })
})

test.describe("sku options", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()
  const company = faker.company.companyName()
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  const name = `${firstName} ${lastName}`

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
            {
              name: "Engraving",
              value: {
                Company: company,
                "First Name": firstName,
                "Last Name": lastName,
              },
            },
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

test.describe("with tax included", () => {
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

    await checkoutPage.checkTaxSummary("To be calculated")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.checkTaxLine("Tax included€0,00")
    await checkoutPage.checkTaxSummary("€0,00")
  })
})

test.describe("with tax not included", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()

  const cartUrl = "https://www.google.it"
  test.use({
    defaultParams: {
      order: "with-items",
      market: process.env.NEXT_PUBLIC_MARKET_ID_SINGLE_SHIPPING_METHOD,
      orderAttributes: {
        cart_url: cartUrl,
        customer_email: customerEmail,
      },
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
    },
  })

  test("link below summary", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkTaxSummary("To be calculated")

    await checkoutPage.setBillingAddress(usAddress)
    await checkoutPage.save("Customer")
    await checkoutPage.checkStep("Payment", "open")
    await checkoutPage.checkTaxLine("Tax$26.14")
    await checkoutPage.checkTaxSummary("$26.14")
  })

  test("total tax on coupon removal", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkTaxSummary("To be calculated")

    await checkoutPage.setBillingAddress(usAddress)
    await checkoutPage.save("Customer")
    await checkoutPage.checkStep("Payment", "open")
    await checkoutPage.checkTaxLine("Tax$26.14")
    await checkoutPage.checkTaxSummary("$26.14")

    await checkoutPage.setCoupon("coupon100")
    await checkoutPage.checkDiscountAmount("-$100.00")
    await checkoutPage.checkTaxLine("Tax$4.14")
    await checkoutPage.checkTaxSummary("$4.14")
    await checkoutPage.checkTotalAmount("$29.94")

    await checkoutPage.removeCoupon()
    await checkoutPage.checkDiscountAmount("")
    await checkoutPage.checkTaxLine("Tax$26.14")
    await checkoutPage.checkTaxSummary("$26.14")
    await checkoutPage.checkTotalAmount("$151.94")
  })
})
