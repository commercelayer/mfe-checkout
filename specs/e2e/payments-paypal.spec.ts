import { faker } from "@faker-js/faker"

import { test } from "../fixtures/tokenizedPage"
import { euAddress } from "../utils/addresses"

test.describe("guest with Paypal", () => {
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

  test("Checkout order", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.setPayment("paypal")

    await checkoutPage.save("Payment", "Paga con PayPal")

    await checkoutPage.checkPaymentRecap("PayPal")
    await checkoutPage.page.reload()

    await checkoutPage.checkPaymentRecap("PayPal")
  })
})

test.describe("digital products with Paypal", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()
  test.use({
    defaultParams: {
      order: "digital",
      orderAttributes: {
        customer_email: customerEmail,
      },
    },
  })

  test("Checkout order", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.setBillingAddress()

    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Shipping", "not_present")

    await checkoutPage.setPayment("paypal")

    await checkoutPage.save("Payment", "Paga con PayPal")

    await checkoutPage.checkPaymentRecap("PayPal")
    await checkoutPage.page.reload()

    await checkoutPage.checkPaymentRecap("PayPal")
  })
})
