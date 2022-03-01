import { test, expect } from "../fixtures/tokenizedPage"

test.use({
  defaultParams: {
    order: "bundle+skus",
  },
})

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

  await checkoutPage.checkShippingSummary("FREE")
  await checkoutPage.continue("Shipping")
  element = await checkoutPage.page.locator("[data-cy=step_payment]")
  expect(element).toHaveAttribute("data-status", "true")
  expect(
    checkoutPage.page.locator(
      "[data-test-id=stripe_payments] >> text=Credit Card"
    )
  ).toBeVisible()
  await checkoutPage.page.click(
    "[data-test-id=stripe_payments] >> text=Credit card",
    { force: true }
  )
  await checkoutPage.checkPaymentSummary("€10,00")

  // await checkoutPage.setPayment("stripe")
  // expect(
  //   checkoutPage.page.locator("[data-cy=payment-source] >> text=ending in 4242")
  // ).toBeVisible()

  await checkoutPage.continue("Payment")

  expect(
    checkoutPage.page.locator("text=Order successfully placed!")
  ).toBeVisible()

  expect(
    checkoutPage.page.locator(
      "[data-cy=payment-recap] >> text=Visa ending in 4242"
    )
  ).toBeVisible()
})
