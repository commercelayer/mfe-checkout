import { faker } from "@faker-js/faker"

import { test, expect } from "../fixtures/tokenizedPage"
import { euAddress } from "../utils/addresses"

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

    // await checkoutPage.checkShippingSummary("To be calculated")
    // expect(checkoutPage.page.locator("text=Standard Shipping")).toBeVisible()
    // await checkoutPage.page.click(
    //   "[data-cy=shipping-methods-container] >> text=Standard Shipping"
    // )

    // await checkoutPage.checkShippingSummary("FREE")
    // await checkoutPage.continue("Shipping")
    // element = await checkoutPage.page.locator("[data-cy=step_payment]")
    // expect(element).toHaveAttribute("data-status", "true")
    // expect(
    //   checkoutPage.page.locator(
    //     "[data-test-id=stripe_payments] >> text=Credit Card"
    //   )
    // ).toBeVisible()
    // await checkoutPage.page.click(
    //   "[data-test-id=stripe_payments] >> text=Credit card",
    //   { force: true }
    // )
    // await checkoutPage.checkPaymentSummary("€10,00")

    // await checkoutPage.setPayment("stripe")

    // await checkoutPage.continue("Payment")

    // expect(
    //   checkoutPage.page.locator("text=Order successfully placed!")
    // ).toBeVisible()

    // expect(
    //   checkoutPage.page.locator(
    //     "[data-cy=payment-recap] >> text=Visa ending in 4242"
    //   )
    // ).toBeVisible()
  })
})
