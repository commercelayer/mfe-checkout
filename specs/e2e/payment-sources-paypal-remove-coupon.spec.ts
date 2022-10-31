import { faker } from "@faker-js/faker"

import { test } from "../fixtures/tokenizedPage"
import { euAddress } from "../utils/addresses"

const TIMEOUT = 2000

test.describe("payment source amount mismatch for coupon with paypal", () => {
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
      couponCode: "testcoupon",
    },
  })

  test("checkout remove coupon", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.save("Shipping")
    await checkoutPage.selectPayment("paypal")

    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.removeCoupon()
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.save("Shipping")
    await checkoutPage.setPayment("paypal")
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.save("Payment", "Paga con PayPal")
  })
})
