// Regression test for a race where clicking a step accordion right after the
// active step changed (or while a background order refetch was in flight)
// closed the step instead of opening it. See AccordionProvider (derived
// isActive) and useActiveStep (manual-navigation guard).
import { faker } from "@faker-js/faker"

import { test } from "../fixtures/tokenizedPage"

const customerEmail = faker.internet.email().toLocaleLowerCase()

test.describe("accordion race", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "BABYONBU000000E63E7412MX", quantity: 2 },
      ],
      orderAttributes: {
        customer_email: customerEmail,
      },
    },
  })

  test("fast reopen with a late order refetch keeps the customer step open", async ({
    checkoutPage,
  }) => {
    const page = checkoutPage.page

    await checkoutPage.checkOrderSummary("Order Summary")
    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.setCustomerMail()
    await checkoutPage.setBillingAddress()

    // Hold every order GET that starts after the save cycle completes, then
    // release them right after the reopen click: a late refetch must not
    // clobber the user's step selection.
    let holding = false
    const held: Array<() => void> = []
    await page.route(/\/api\/orders\//, async (route) => {
      if (holding && route.request().method() === "GET") {
        held.push(() => route.continue())
        return
      }
      await route.continue()
    })

    await checkoutPage.save("Customer")
    holding = true

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.clickAccordion("Customer")
    await checkoutPage.checkStep("Customer", "open")

    // Immediately switch step and reopen: the second click used to read a
    // stale isActive and close the step instead of opening it.
    await checkoutPage.clickStep("Shipping")
    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.clickAccordion("Customer")
    holding = false
    for (const release of held.splice(0)) {
      release()
    }
    await checkoutPage.checkStep("Customer", "open")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "close")
  })
})
