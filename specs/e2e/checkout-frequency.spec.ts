import { faker } from "@faker-js/faker"
import { euAddress } from "specs/utils/addresses"

import { test, expect } from "../fixtures/tokenizedPage"

const customerEmail = faker.internet.email().toLocaleLowerCase()

test.describe("Guest checking out a subscription", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        {
          sku_code: "BABYONBU000000E63E7412MX",
          quantity: 1,
          frequency: "monthly",
        },
      ],
      orderAttributes: {
        customer_email: customerEmail,
      },
    },
  })

  test("should execute a checkout with alert on subscription", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.setCustomerMail()
    await checkoutPage.checkCustomerAddressesTitle(
      "Fill in your billing/shipping address"
    )
    await checkoutPage.setBillingAddress()

    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.checkShippingSummary("To be calculated")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.checkShippingSummary("FREE")
    await checkoutPage.save("Shipping")

    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.selectPayment("stripe")

    await expect(
      checkoutPage.page.locator(
        "text=An account must be created in order to purchase your subscription."
      )
    ).toBeVisible()

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")
    await checkoutPage.checkPaymentRecap("Visa ending in 4242")
  })
})

test.describe("Customer checking out a subscription", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()
  const customerPassword = faker.internet.password()

  test.use({
    defaultParams: {
      order: "with-items",
      customer: {
        email: customerEmail,
        password: customerPassword,
      },
      lineItemsAttributes: [
        {
          sku_code: "CANVASAU000000FFFFFF1824",
          quantity: 1,
          frequency: "monthly",
        },
      ],
    },
  })

  test("should execute a checkout automatically saving the payment source", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.page.locator(`text=${customerEmail}`)

    await checkoutPage.setBillingAddress(euAddress)

    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.checkShippingSummary("FREE")
    await checkoutPage.save("Shipping")

    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.selectPayment("stripe")

    await expect(
      checkoutPage.page.locator(
        "text=By providing your card information, you allow the company to charge your card for future payments in accordance with their terms."
      )
    ).toBeVisible()

    await checkoutPage.checkCustomerCardCount(0)

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")
    await checkoutPage.checkPaymentRecap("Visa ending in 4242")
  })

  test("Checkout order with customer wallet", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.setBillingAddress(euAddress)

    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.page.waitForTimeout(1000)

    await checkoutPage.checkCustomerCardCount(1)

    await checkoutPage.useCustomerCard()

    await checkoutPage.page.waitForTimeout(2000)

    await checkoutPage.checkPaymentSummary("€10,00")
    await checkoutPage.page.waitForTimeout(2000)

    await checkoutPage.save("Payment")
  })

  test("Avoid saving a customer payment source on order subscription", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.setBillingAddress(euAddress)

    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.page.waitForTimeout(1000)

    await checkoutPage.checkCustomerCardCount(1)
  })
})
