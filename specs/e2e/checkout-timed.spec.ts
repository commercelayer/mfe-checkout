import { faker } from "@faker-js/faker"

import { expect, test } from "../fixtures/tokenizedPage"

const customerEmail = faker.internet.email().toLocaleLowerCase()

test.describe("with expires_at in the future", () => {
  test.describe("no expiration_info", () => {
    test.use({
      defaultParams: {
        order: "with-items",
        lineItemsAttributes: [
          { sku_code: "BABYONBU000000E63E7412MX", quantity: 2 },
        ],
        orderAttributes: {
          customer_email: customerEmail,
          expires_at: new Date(Date.now() + 1000 * 60 * 15).toISOString(),
        },
      },
    })

    test("should execute a checkout", async ({ checkoutPage }) => {
      await checkoutPage.checkOrderSummary("Order Summary")
      await checkoutPage.page.getByTestId("expiration-timer").waitFor()
      const message = checkoutPage.page.getByTestId("active-message")
      await expect(message).toHaveText(
        "Make sure to complete your purchase before then.",
      )
    })
  })

  test.describe("with expiration_info", () => {
    test.use({
      defaultParams: {
        order: "with-items",
        lineItemsAttributes: [
          { sku_code: "BABYONBU000000E63E7412MX", quantity: 2 },
        ],
        orderAttributes: {
          customer_email: customerEmail,
          expires_at: new Date(Date.now() + 1000 * 60 * 15).toISOString(),
          expiration_info: {
            active_message: "Your session will expire soon.",
          },
        },
      },
    })

    test("should execute a checkout", async ({ checkoutPage }) => {
      await checkoutPage.checkOrderSummary("Order Summary")
      await checkoutPage.page.getByTestId("expiration-timer").waitFor()
      const message = checkoutPage.page.getByTestId("active-message")
      await expect(message).toHaveText("Your session will expire soon.")
    })
  })
})

test.describe("with expires_at in the past", () => {
  test.describe("no expiration_info", () => {
    test.use({
      defaultParams: {
        order: "with-items",
        lineItemsAttributes: [
          { sku_code: "BABYONBU000000E63E7412MX", quantity: 2 },
        ],
        orderAttributes: {
          customer_email: customerEmail,
          expires_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        },
      },
    })
    test("should display the expired page", async ({ checkoutPage }) => {
      const element = checkoutPage.page.getByTestId("expiration-timer")
      await expect(element).toHaveCount(0)
      await checkoutPage.page.getByTestId("expired-page").waitFor()
      const expiredMessageElement =
        checkoutPage.page.getByTestId("expired-message")
      await expiredMessageElement.waitFor()

      expect(expiredMessageElement).toHaveText(
        "Your order was not completed. Please try again with a new order.",
      )
    })
  })
  test.describe("with expiration_info", () => {
    test.use({
      defaultParams: {
        order: "with-items",
        lineItemsAttributes: [
          { sku_code: "BABYONBU000000E63E7412MX", quantity: 2 },
        ],
        orderAttributes: {
          customer_email: customerEmail,
          expires_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          expiration_info: {
            expired_message: "Your session has expired.",
            return_url: "https://yourshop.com/",
          },
        },
      },
    })
    test("should display the expired page", async ({ checkoutPage }) => {
      const element = checkoutPage.page.getByTestId("expiration-timer")
      await expect(element).toHaveCount(0)
      await checkoutPage.page.getByTestId("expired-page").waitFor()
      const expiredMessageElement =
        checkoutPage.page.getByTestId("expired-message")
      await expiredMessageElement.waitFor()
      expect(expiredMessageElement).toHaveText("Your session has expired.")
      await checkoutPage.page.getByTestId("button-expire-url-to-shop").waitFor()
    })
  })
})
