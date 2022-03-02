import { faker } from "@faker-js/faker"

import { test, expect } from "../fixtures/tokenizedPage"
import { euAddress } from "../utils/addresses"

const customerEmail = faker.internet.email().toLocaleLowerCase()

test.describe("with Paypal", () => {
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
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()

    const element = await checkoutPage.page.locator("[data-cy=step_shipping]")
    expect(element).toHaveAttribute("data-status", "true")

    await checkoutPage.page.click(
      "[data-cy=shipping-methods-container] >> text=Standard Shipping"
    )

    await checkoutPage.continue("Shipping")

    await checkoutPage.setPayment("paypal")

    await checkoutPage.continue("Payment", "Paga con PayPal")

    await checkoutPage.page.fill(
      "input[name=login_email]",
      process.env.NEXT_PUBLIC_PAYPAL_EMAIL as string
    )

    await checkoutPage.page.click("#btnNext")

    await checkoutPage.page.fill(
      "input[name=login_password]",
      process.env.NEXT_PUBLIC_PAYPAL_PASSWORD as string
    )

    await checkoutPage.page.click("#btnLogin")
    await checkoutPage.page.click('[data-testid="submit-button-initial"]')

    await checkoutPage.page
      .locator("text=Order succesfully placed")
      .waitFor({ state: "visible" })
  })
})
