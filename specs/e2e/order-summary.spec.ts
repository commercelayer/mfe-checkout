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
      "[data-testid=order-summary] >> text=Quantity: 5"
    )
    await expect(element).toHaveText("QUANTITY: 5")

    element = checkoutPage.page.locator(
      "[data-testid=order-summary] >> text=Quantity: 1"
    )
    await expect(element).toHaveText("QUANTITY: 1")

    await checkoutPage.checkStep("Shipping", "open")

    element = checkoutPage.page.locator(
      "[data-testid=shipments-container] >> text=Quantity: 5"
    )
    await expect(element).toHaveText("QUANTITY: 5")

    element = checkoutPage.page.locator(
      "[data-testid=shipments-container] >> text=Quantity: 1"
    )
    await expect(element).toHaveText("QUANTITY: 1")
  })
})

test.describe("sku options", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()
  const company = faker.company.name()
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
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

test.describe("sku options with price", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const letters = `${firstName[0]}${lastName[0]}`

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
          final_quantity: 2,
          sku_options: [
            {
              name: "Initials",
              value: {
                letters,
              },
            },
          ],
        },
      ],
      addresses: {
        billingAddress: euAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("should match SKUs quantity", async ({ checkoutPage }) => {
    test.skip()
    await checkoutPage.checkOrderSummary("Order Summary")
    await checkoutPage.checkStep("Shipping", "open")
    const element = checkoutPage.page.locator(`text=Letters:${letters}`)
    await expect(element).toHaveCount(1)
    await checkoutPage.checkLineItemAmount("€200,00")
  })
})

test.describe("buying gift card", () => {
  test.use({
    defaultParams: {
      order: "gift-card",
    },
  })

  test("should appear on summary", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    const element = checkoutPage.page.locator(
      "[data-testid=line-items-gift_cards] >> text=Gift card: €100,00"
    )

    await expect(element).toHaveCount(1)

    await checkoutPage.checkGiftCardAmount()
  })
})

test.describe("using gift card", () => {
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
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 3 },
      ],
      addresses: {
        billingAddress: euAddress,
        sameShippingAddress: true,
      },
      giftCardAttributes: {
        balance_cents: 2000,
        apply: true,
      },
    },
  })

  test("should appear on totals, not on summary", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.checkGiftCardAmount("-€20,00")
    let element = checkoutPage.page.locator(
      "[data-testid=line-items-gift_cards]"
    )
    await expect(element).toHaveCount(0)

    element = checkoutPage.page.locator(
      "[data-testid=items-count] >> text=Your shopping cart contains 3 items"
    )
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
      market: "US",
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
    await checkoutPage.checkDiscountAmount(undefined)
    await checkoutPage.checkTaxLine("Tax$26.14")
    await checkoutPage.checkTaxSummary("$26.14")
    await checkoutPage.checkTotalAmount("$151.94")
  })
})

test.describe("with digital product", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()

  test.use({
    defaultParams: {
      order: "with-items",
      market: "US",
      orderAttributes: {
        customer_email: customerEmail,
      },
      lineItemsAttributes: [{ sku_code: "NFTEBOOK", quantity: 1 }],
    },
  })

  test("should calculate taxes after customer step", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.setCustomerMail()
    await checkoutPage.setBillingAddress(usAddress)
    await checkoutPage.checkStep("Customer", "open")
    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "not_present")

    await checkoutPage.checkShippingSummary(undefined)

    await checkoutPage.checkTaxLine("Tax$3.30")
    await checkoutPage.checkTaxSummary("$3.30")

    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.setPayment("stripe")
    await checkoutPage.save("Payment")

    await checkoutPage.checkPaymentRecap("Visa ending in 4242")
  })
})

test.describe("count with only free items", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()

  test.use({
    defaultParams: {
      order: "with-items",
      orderAttributes: {
        customer_email: customerEmail,
      },
      lineItemsAttributes: [{ sku_code: "APPTESLA", quantity: 2 }],
    },
  })

  test("should count the right items ", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkLineItemsCount(
      "Your shopping cart contains 2 items"
    )
  })
})

test.describe("count with mixed items", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()

  test.use({
    defaultParams: {
      order: "with-items",
      orderAttributes: {
        customer_email: customerEmail,
      },
      lineItemsAttributes: [
        { sku_code: "APPTESLA", quantity: 2 },
        { sku_code: "BABYONBU000000E63E7412MX", quantity: 3 },
      ],
    },
  })

  test("should count the right items", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkLineItemsCount(
      "Your shopping cart contains 5 items"
    )
  })
})

test.describe("count using gift card", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "TSHIRTMMFFFFFF000000XLXX", quantity: 5 },
      ],
      giftCardAttributes: {
        balance_cents: 10000,
        apply: true,
      },
    },
  })

  test("should count the right items", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    await checkoutPage.checkLineItemsCount(
      "Your shopping cart contains 5 items"
    )
  })
})

test.describe("count buying gift card", () => {
  test.use({
    defaultParams: {
      order: "gift-card",
    },
  })

  test("should count the right items", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    await checkoutPage.checkLineItemsCount("Your shopping cart contains 1 item")
  })
})

test.describe("line item with frequency", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        {
          sku_code: "TSHIRTMMFFFFFF000000XLXX",
          quantity: 1,
          frequency: "monthly",
        },
      ],
    },
  })

  test("should show the monthly frequency", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    await checkoutPage.checkLineItemFrequency("Monthly")
  })
})

test.describe("line item without frequency", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        {
          sku_code: "TSHIRTMMFFFFFF000000XLXX",
          quantity: 1,
        },
      ],
    },
  })

  test("should show the monthly frequency", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    await checkoutPage.checkLineItemFrequency()
  })
})
