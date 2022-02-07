import { test, expect } from "../fixtures/tokenizedPage"

test("should execute a checkout with valid token", async ({ checkoutPage }) => {
  await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()
  await checkoutPage.setCustomerMail("alessani@gmail.com")
  await checkoutPage.setBillingAddress()
  let element = await checkoutPage.page.locator("[data-cy=step_customer]")
  expect(element).toHaveAttribute("data-status", "true")
  await checkoutPage.continue("Customer")

  element = await checkoutPage.page.locator("[data-cy=step_shipping]")
  expect(element).toHaveAttribute("data-status", "true")

  await checkoutPage.checkShippingSummary("To be calculated")
  expect(checkoutPage.page.locator("text=Standard Shipping")).toBeVisible()
  await checkoutPage.page.click(
    "[data-cy=shipping-methods-container] >> text=Standard Shipping"
  )

  await checkoutPage.checkShippingSummary("€7,01")
  await checkoutPage.continue("Shipping")
  element = await checkoutPage.page.locator("[data-cy=step_payment]")
  expect(element).toHaveAttribute("data-status", "true")
  expect(checkoutPage.page.locator("text=Credit Card")).toBeVisible()
  await checkoutPage.page.click(
    "[data-cy=payment-sources-container] >> text=Credit card",
    { force: true }
  )
  await checkoutPage.checkPaymentSummary("€10,00")

  await checkoutPage.setStripePayment()
  await checkoutPage.continue("Payment")
})
