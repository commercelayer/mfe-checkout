import { expect, test } from "../fixtures/newPaymentsPage"

/**
 * Google Pay on the `payment_sessions` model, through the same Adyen Drop-in as
 * the card and PayPal.
 *
 * The second **Gateway-Owned Button**, and the one that shows whether the
 * pattern generalises or was shaped around PayPal. It arrives there by a
 * different route: PayPal's `submit` throws outright, while Google Pay's works
 * — it resolves our `onClick` and then calls `loadPaymentData()`. That call has
 * to happen inside the click's user gesture, and our place sequence charges the
 * gift cards first, so by then the gesture is spent and the sheet never opens.
 * Hence the split this suite exists to hold in place: the gate on the click,
 * synchronous, and the gift cards on `onAuthorized`, after the sheet.
 *
 * **What is not covered, and why.** Completing a Google Pay payment needs a
 * signed-in Google account holding a card from the API test allowlist, and
 * Playwright's Chromium has no profile at all. So these tests stop where the
 * sheet opens. That boundary is not a compromise on the interesting part: the
 * sheet opening *is* the assertion that the gesture survived, which is the one
 * thing about this design that could be wrong.
 */
test.describe("paying with Google Pay through Adyen", {
  tag: "@payment-sessions",
}, () => {
  test("moves collection to Google Pay's own button, and back", async ({
    checkout,
  }) => {
    test.setTimeout(120_000)

    await checkout.selectPaymentSetting("Adyen")
    await checkout.acceptTerms()

    await expect(checkout.placeButton).toBeEnabled()
    await expect(checkout.gatewayOwnsButtonHint).toBeHidden()

    await checkout.selectAdyenGooglePay()

    await expect(checkout.placeButton).toBeDisabled()
    await expect(checkout.gatewayOwnsButtonHint).toBeVisible()

    await checkout.selectAdyenCard()

    await expect(checkout.placeButton).toBeEnabled()
    await expect(checkout.gatewayOwnsButtonHint).toBeHidden()
  })

  /**
   * The gate, and the reason it had to be reported rather than only enforced.
   *
   * Google's button has no enable/disable actions — PayPal's `onInit` has no
   * equivalent here — so there is no disabled state to render. A refusal that
   * said nothing would leave a button that simply does nothing, with no way for
   * the shopper to find out why.
   */
  test("explains itself when clicked before the terms are accepted", async ({
    checkout,
  }) => {
    test.setTimeout(120_000)

    await checkout.selectPaymentSetting("Adyen")
    await checkout.selectAdyenGooglePay()
    // Deliberately not accepting them.

    await checkout.adyenGooglePayButton.click({ force: true })

    await expect(checkout.adyenError).toContainText(/terms/i, {
      timeout: 30_000,
    })
  })

  /**
   * The assertion the whole design rests on: the sheet opens.
   *
   * If the gate on the click were asynchronous — or if the gift cards were
   * charged there, as PayPal's are — `loadPaymentData()` would run outside the
   * gesture and Google would refuse to open anything. The failure would be
   * intermittent rather than reliable, which is why it is worth a test of its
   * own rather than a comment.
   *
   * Google renders the sheet in an iframe it owns, so what is asserted is its
   * arrival, not its contents: with no signed-in account there is nothing in it
   * to choose.
   */
  test("opens Google's sheet, so the click's gesture survived", async ({
    checkout,
  }) => {
    test.setTimeout(120_000)

    await checkout.selectPaymentSetting("Adyen")
    await checkout.selectAdyenGooglePay()
    await checkout.acceptTerms()

    await checkout.adyenGooglePayButton.click({ force: true })

    // Google's payment sheet, whatever it goes on to show.
    await expect(
      checkout.page
        .locator("iframe[src*='pay.google.com'], iframe[name*='googlepay']")
        .first(),
      "Google Pay's sheet did not open — the click's user gesture was spent before loadPaymentData()",
    ).toBeAttached({ timeout: 30_000 })

    // And nothing was reported: the gate was open and the click did no I/O.
    await expect(checkout.adyenError).toBeHidden()
  })
})
