import { faker } from "@faker-js/faker"
import { test } from "../fixtures/tokenizedPage"
import { atAddress } from "../utils/addresses"

const customerEmail = faker.internet.email().toLocaleLowerCase()

test.use({
  defaultParams: {
    market: "AT",
    order: "with-items",
    orderAttributes: {
      customer_email: customerEmail,
    },
    lineItemsAttributes: [
      {
        sku_code: "BABYONBU000000E63E7412MX", // Using a product with known price
        quantity: 1,
      },
    ],
    addresses: {
      billingAddress: atAddress,
      sameShippingAddress: true,
    },
  },
})

test("should show 20% VAT for Austrian customer", async ({ checkoutPage }) => {
  await checkoutPage.checkOrderSummary("Order Summary")

  await checkoutPage.selectPayment("stripe")
  await checkoutPage.setPayment("stripe")
  await checkoutPage.save("Payment")

  // Verify tax amount is 20% of subtotal

  await checkoutPage.checkTaxSummary("€4,83") // 20% of €29,00

  await checkoutPage.checkPaymentRecap("Visa ending in 4242")
})
