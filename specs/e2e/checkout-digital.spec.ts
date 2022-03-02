import { test, expect } from "../fixtures/tokenizedPage"

test.use({
  defaultParams: {
    order: "digital",
  },
})

test("should execute a digital checkout with valid token", async ({
  checkoutPage,
}) => {
  await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()
  await checkoutPage.setCustomerMail()
  await checkoutPage.setBillingAddress()
  let element = await checkoutPage.page.locator("[data-cy=step_customer]")
  expect(element).toHaveAttribute("data-status", "true")
  await checkoutPage.save("Customer")

  element = await checkoutPage.page.locator("[data-cy=step_shipping]")
  expect(element).toHaveCount(0)

  element = await checkoutPage.page.locator("[data-cy=shipping-amount]")
  expect(element).toHaveCount(0)

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

  await checkoutPage.setPayment("stripe")
  await checkoutPage.save("Payment")

  expect(
    checkoutPage.page.locator("text=Order successfully placed!")
  ).toBeVisible()

  expect(
    checkoutPage.page.locator(
      "[data-cy=payment-recap] >> text=Visa ending in 4242"
    )
  ).toBeVisible()
})
