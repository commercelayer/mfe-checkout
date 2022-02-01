import { test, expect } from "../fixtures/tokenizedPage"

test("should navigate to checkout with valid token", async ({
  checkoutPage,
}) => {
  await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()
  await checkoutPage.setCustomerMail("alessani@gmail.com")
  await checkoutPage.setBillingAddress()
  let element = await checkoutPage.page.locator("[data-cy=step_customer]")
  expect(element).toHaveAttribute("data-status", "true")
  await checkoutPage.continue()

  element = await checkoutPage.page.locator("[data-cy=step_shipping]")
  expect(element).toHaveAttribute("data-status", "true")
})
