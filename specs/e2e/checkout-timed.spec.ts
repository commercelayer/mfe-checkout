import { faker } from "@faker-js/faker"

import { expect, test } from "../fixtures/tokenizedPage"

const customerEmail = faker.internet.email().toLocaleLowerCase()

test.describe("with expires_at in the future", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "BABYONBU000000E63E7412MX", quantity: 2 },
      ],
      orderAttributes: {
        customer_email: customerEmail,
        // expires_at: new Date(Date.now() + 1000 * 60 * 15).toISOString(),
      },
    },
  })

  test.skip("should execute a checkout", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    await checkoutPage.page.getByTestId("expiration-timer").waitFor()
  })
})

test.describe("with expires_at in the past", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "BABYONBU000000E63E7412MX", quantity: 2 },
      ],
      orderAttributes: {
        customer_email: customerEmail,
        // expires_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
    },
  })

  test.skip("should display the expired page", async ({ checkoutPage }) => {
    const element = checkoutPage.page.getByTestId("expiration-timer")
    await expect(element).toHaveCount(0)
    await checkoutPage.page.getByTestId("expired-page").waitFor()
  })
})
