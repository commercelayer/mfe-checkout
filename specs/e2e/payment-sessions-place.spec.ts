import {
  expect,
  expectPaymentToCoverTheOrder,
  PaymentSessionsCheckoutPage,
  readOrder,
  test,
} from "../fixtures/newPaymentsPage"

/**
 * The three ways an order on the `payment_sessions` model can be paid for
 * today, each taken all the way to a placed order and then read back over the
 * API.
 *
 * The read-back is not belt and braces. Every one of these ends on a
 * thank-you page that looks right whatever was charged, so the UI cannot be
 * the assertion — only the sessions summing exactly to the order total says
 * the shopper was charged what they agreed to. That is also the assertion a
 * new payment setting is most likely to break, since its session is sized by
 * the same rules.
 */
test.describe("placing an order on the payment_sessions model", {
  tag: "@payment-sessions",
}, () => {
  test("pays the whole order with a manual payment setting", async ({
    checkout,
    newPaymentsOrder,
  }) => {
    await checkout.selectPaymentSetting("Wire Transfer Payment Setting")
    await checkout.acceptTerms()
    await checkout.placeOrder()

    await expect(checkout.paymentRecap).toContainText(
      "Wire Transfer Payment Setting",
    )
    await expectPaymentToCoverTheOrder(newPaymentsOrder, { sessions: 1 })
  })

  test("splits the order between a gift card and a manual payment setting", async ({
    checkout,
    newPaymentsOrder,
    mintGiftCard,
  }) => {
    const code = await mintGiftCard(10)
    const totalBefore = await checkout.totalAmount.innerText()

    await checkout.applyGiftCardSuccessfully(code)

    // The gift card line appears and the total drops to what is left to pay.
    // Asserted as a change rather than against a literal, so the fixture's SKU
    // and shipping method stay free to move.
    await expect(checkout.giftCardAmount).toBeVisible()
    await expect(checkout.totalAmount).not.toHaveText(totalBefore)

    await checkout.selectPaymentSetting("Wire Transfer Payment Setting")
    await checkout.acceptTerms()
    await checkout.placeOrder()

    // Both payments are named on the recap. An empty or partial recap here is
    // usually a component missing from one of the two payment trees rather
    // than a payment that failed.
    await expect(checkout.paymentRecap).toContainText(
      "Wire Transfer Payment Setting",
    )
    await expect(checkout.paymentRecap).toContainText(code)

    await expectPaymentToCoverTheOrder(newPaymentsOrder, { sessions: 2 })
  })

  /**
   * Gift cards can cover an order outright, and then there is no method session
   * at all and the setting selector disappears — so this is the one path where
   * the order is placed without anything being selected. The card is minted for
   * exactly the order total, read from the API, so the test carries no magic
   * number and exercises the exact-cover boundary.
   */
  test("pays the whole order with a gift card and no payment setting", async ({
    checkout,
    newPaymentsOrder,
    mintGiftCard,
  }) => {
    const { total_amount_with_taxes_cents: total } =
      await readOrder(newPaymentsOrder)
    expect(total, "the fixture order has no total to cover").toBeGreaterThan(0)

    const code = await mintGiftCard((total as number) / 100)

    await checkout.applyGiftCardSuccessfully(code)
    await expect(checkout.paymentSettings).toHaveCount(0)

    await checkout.acceptTerms()
    await checkout.placeOrder()

    await expect(checkout.paymentRecap).toContainText(code)
    await expectPaymentToCoverTheOrder(newPaymentsOrder, { sessions: 1 })
  })

  /**
   * The organization config is optional decoration — branding, the terms and
   * privacy links — and the checkout has to survive it not arriving. It is
   * fetched several times per page load, so a transient failure is likelier
   * than it looks, and this is the deterministic version of a flake that took
   * this suite down: the failure used to reach the host application, and under
   * `next dev` its error overlay then covered the page and absorbed every
   * click, so the checkout was unusable because an optional setting had not
   * loaded.
   *
   * It stops at selecting a payment setting rather than placing. Without the
   * config there are no terms and privacy URLs, and the library then stops
   * requiring the checkbox while this application still renders one from its
   * own settings fetch — a discrepancy worth knowing about, but a different
   * subject, and asserting through it would make this test fail for a reason
   * that has nothing to do with the page surviving.
   *
   * Only the library's own request is aborted: it asks for exactly `id,config`,
   * while the application's settings fetch asks for the branding fields. That
   * one failing is meant to show the "Connectivity issues" page — the correct
   * behaviour, and not this one.
   */
  test("stays usable when the organization config cannot be fetched", async ({
    page,
    newPaymentsOrder,
  }) => {
    // Navigates by hand rather than through the `checkout` fixture: the route
    // has to be in place before the first load, and reloading into it is not
    // the same thing.
    await page.route("**/organization?**", async (route) => {
      const url = new URL(route.request().url())
      const fields = url.searchParams.get("fields[organizations]")
      await (fields === "id,config" ? route.abort("failed") : route.continue())
    })

    const checkout = new PaymentSessionsCheckoutPage(page)
    await page.goto(
      `/${newPaymentsOrder.id}?accessToken=${newPaymentsOrder.accessToken}`,
    )

    // Rendered at all, and the controls answer — which is what the overlay took
    // away when this failure reached the host application.
    await checkout.waitForPaymentStep()
    await checkout.selectPaymentSetting("Wire Transfer Payment Setting")
  })
})
