import { faker } from "@faker-js/faker"

import { test, expect } from "../fixtures/tokenizedPage"
import { euAddress, euAddress2 } from "../utils/addresses"

const customerEmail = faker.internet.email().toLocaleLowerCase()

test.describe("with customer email", () => {
  test.use({
    defaultParams: {
      order: "plain",
      orderAttributes: {
        customer_email: customerEmail,
      },
    },
  })

  test("Checkout guest address", async ({ checkoutPage }) => {
    await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()
    const email = await checkoutPage.getCustomerMail()

    await expect(email).toHaveValue(customerEmail)

    await checkoutPage.setCustomerMail("customer@example.com")
    await checkoutPage.blurCustomerEmail()
    // email = await checkoutPage.getCustomerMail()
    // await expect(email).toHaveValue(customerEmail)

    await checkoutPage.setBillingAddress()

    let element = await checkoutPage.page.locator("[data-cy=step_customer]")
    expect(element).toHaveAttribute("data-status", "true")
    await checkoutPage.continue("Customer")

    await checkoutPage.checkCustomerEmail("customer@example.com")

    element = await checkoutPage.page.locator("[data-cy=step_shipping]")
    expect(element).toHaveAttribute("data-status", "true")

    await checkoutPage.clickStep("step_customer")

    await checkoutPage.checkBillingAddress(euAddress)

    await checkoutPage.shipToDifferentAddress()
    element = await checkoutPage.page.locator(
      "[data-cy=button-ship-to-different-address]"
    )
    expect(element).toHaveAttribute("data-status", "true")

    await checkoutPage.setShippingAddress()

    await checkoutPage.continue("Customer")

    await checkoutPage.clickStep("step_customer")
    await checkoutPage.checkBillingAddress(euAddress)
    await checkoutPage.checkShippingAddress(euAddress2)
  })
})
