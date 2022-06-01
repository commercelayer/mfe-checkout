import { faker } from "@faker-js/faker"

import { test, expect } from "../fixtures/tokenizedPage"
import { euAddress } from "../utils/addresses"

const customerEmail = faker.internet.email().toLocaleLowerCase()
test.describe("bundle with shippable skus", () => {
  test.use({
    defaultParams: {
      order: "bundle",
    },
  })

  test("complete checkout", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.setCustomerMail()
    await checkoutPage.setBillingAddress()

    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.checkShippingSummary("To be calculated")

    await expect(
      checkoutPage.page.locator("text=Standard Shipping")
    ).toBeVisible()

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.checkShippingSummary("FREE")
    await checkoutPage.save("Shipping")

    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.checkPaymentSummary("€10,00")

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")

    await checkoutPage.checkPaymentRecap("Visa ending in 4242")
  })
})

test.describe("bundle with do not ship skus", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [{ bundle_code: "TROPICALTREES", quantity: 1 }],
      orderAttributes: {
        cart_url: faker.internet.url(),
        customer_email: customerEmail,
      },
      addresses: {
        billingAddress: {
          ...euAddress,
        },
        sameShippingAddress: true,
      },
    },
  })

  test("skip delivery step and complete checkout", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Customer", "close")

    await checkoutPage.checkStep("Shipping", "not_present")
    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.checkPaymentSummary("€10,00")

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")

    await checkoutPage.checkPaymentRecap("Visa ending in 4242")
  })
})
