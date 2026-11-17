// Regression test for a race where clicking a step accordion right after the
// active step changed (or while a background order refetch was in flight)
// closed the step instead of opening it. See AccordionProvider (derived
// isActive) and useActiveStep (manual-navigation guard).
import { test } from "../fixtures/tokenizedPage"
import { euAddressNoBillingInfo } from "../utils/addresses"
import { uniqueCustomerEmail } from "../utils/customers"

const customerEmail = uniqueCustomerEmail()

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
    await page.route(/\/api\/(?:[\w-]+\/)?orders\//, async (route) => {
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

test.describe("accordion race with a payment auto-select", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      orderAttributes: {
        customer_email: customerEmail,
      },
      market: "NO",
    },
  })

  // #681: the single payment method's auto-select reports back once its payment
  // source exists, even if the customer has left the Payment step by then. That
  // late report must not take them back to Payment.
  test("reopening customer while the payment source is created keeps it open", async ({
    checkoutPage,
  }) => {
    const page = checkoutPage.page

    await checkoutPage.checkOrderSummary("Order Summary")
    await checkoutPage.checkStep("Customer", "open")
    await checkoutPage.setBillingAddress(euAddressNoBillingInfo)

    let holding = true
    let release: (() => void) | undefined
    const held = new Promise<void>((resolve) => {
      page.route(/\/api\/(?:[\w-]+\/)?\w+_payments(\?|$)/, async (route) => {
        if (holding && route.request().method() === "POST") {
          release = () => route.continue()
          resolve()
          return
        }
        await route.continue()
      })
    })

    await checkoutPage.save("Customer")
    await checkoutPage.checkStep("Payment", "open")
    await held

    await checkoutPage.clickStep("Customer")
    await checkoutPage.checkStep("Customer", "open")

    holding = false
    const created = page.waitForResponse(
      (response) =>
        /\/api\/(?:[\w-]+\/)?\w+_payments(\?|$)/.test(response.url()) &&
        response.request().method() === "POST",
    )
    release?.()
    await created
    await page.waitForResponse(
      (response) =>
        /\/api\/(?:[\w-]+\/)?orders\//.test(response.url()) &&
        response.request().method() === "GET",
    )
    await page.waitForTimeout(1000)

    await checkoutPage.checkStep("Customer", "open")
    await checkoutPage.checkStep("Payment", "close")
  })
})
