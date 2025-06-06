import { faker } from "@faker-js/faker"

import { expect, test } from "../fixtures/tokenizedPage"

import { euAddressNoBillingInfo } from "../utils/addresses"

const customerEmail = faker.internet.email().toLocaleLowerCase()

test.use({
  defaultParams: {
    order: "with-items",
    lineItemsAttributes: [
      { sku_code: "BABYONBU000000E63E7412MX", quantity: 2 },
    ],
    orderAttributes: {
      customer_email: customerEmail,
    },
    market: "MT",
  },
})

test("should execute a checkout with connected account", async ({
  checkoutPage,
}) => {
  await checkoutPage.checkOrderSummary("Order Summary")

  await checkoutPage.setCustomerMail()

  await checkoutPage.setBillingAddress(euAddressNoBillingInfo)

  await checkoutPage.save("Customer")

  await checkoutPage.checkStep("Shipping", "open")

  await expect(
    checkoutPage.page.locator("text=Standard Shipping"),
  ).toBeVisible()

  await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

  await checkoutPage.checkShippingSummary("FREE")
  await checkoutPage.save("Shipping")

  await checkoutPage.checkStep("Payment", "open")

  await checkoutPage.selectPayment("stripe")

  await checkoutPage.setPayment("stripe")

  await checkoutPage.save("Payment")
  await checkoutPage.checkPaymentRecap("Visa ending in 4242")
})
