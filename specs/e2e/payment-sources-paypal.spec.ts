import { faker } from "@faker-js/faker"

import { test } from "../fixtures/tokenizedPage"
import { euAddress } from "../utils/addresses"

const TIMEOUT = 2000

test.describe("payment source amount mismatch with paypal", () => {
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

  test("checkout changing shipping method", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("paypal")

    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.checkTotalAmount("€99,00")

    await checkoutPage.clickStep("Shipping")

    await checkoutPage.selectShippingMethod({ text: "Express Delivery" })

    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.checkTotalAmount("€111,00")

    await checkoutPage.save("Shipping")
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.setPayment("paypal")
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.save("Payment", "Paga con PayPal")
  })

  test("checkout applying coupon", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.save("Shipping")
    await checkoutPage.checkTotalAmount("€99,00")

    await checkoutPage.selectPayment("paypal")

    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.checkTotalAmount("€99,00")

    await checkoutPage.setCoupon("testcoupon")
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.checkTotalAmount("€69,30")
    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.save("Shipping")

    await checkoutPage.setPayment("paypal")

    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.save("Payment", "Paga con PayPal")
  })

  test("checkout applying coupon interrupted", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.save("Shipping")
    await checkoutPage.checkTotalAmount("€99,00")

    await checkoutPage.selectPayment("paypal")

    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.checkTotalAmount("€99,00")

    await checkoutPage.save("Payment", undefined, true)
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.page.click("a#cancelLink")
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.setCoupon("testcoupon")
    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.checkTotalAmount("€69,30")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.save("Shipping")

    await checkoutPage.page.waitForTimeout(TIMEOUT)

    await checkoutPage.save("Payment", "Paga con PayPal")
  })
})
