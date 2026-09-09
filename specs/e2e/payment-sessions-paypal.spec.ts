import {
  expect,
  expectPaymentToCoverTheOrder,
  payPalCredentials,
  test,
} from "../fixtures/newPaymentsPage"

/**
 * Paying with PayPal on the `payment_sessions` model, through the same Adyen
 * Drop-in as the card.
 *
 * One payment setting, two methods, and they are collected in opposite
 * directions. A card form is inert until something submits it, so the
 * checkout's own place button is the pay button — which is what keeps the
 * privacy-and-terms gate in front of every payment. PayPal cannot work that
 * way: `dropin.submit()` on it is an `IMPLEMENTATION_ERROR` and no payment,
 * because a popup needs a real user gesture on PayPal's own branded button. So
 * for PayPal the gate moves inside that button's `onClick`, our button disables
 * itself, and the money arrives with nobody having clicked anything of ours.
 *
 * The environment has to satisfy everything the card suite needs — an Adyen
 * setting with a `public_key`, on an origin the client key authorises — plus
 * two more:
 *
 * - PayPal must be switched on for the Adyen account, or the Drop-in offers no
 *   PayPal row and there is nothing to click;
 * - `NP_PAYPAL_EMAIL` / `NP_PAYPAL_PASSWORD` must be a PayPal **sandbox
 *   buyer** created under the PayPal developer account that owns the business
 *   sandbox account *this* Adyen merchant account is linked to — the `E2E_*`
 *   buyer belongs to another one and is refused. Without them the paying tests
 *   skip rather than fail: an unrunnable test and a broken checkout must not
 *   look alike.
 *
 * Everything past the popup is PayPal's own sandbox UI. It is the least stable
 * thing in this repository and it is not ours, so a failure there is worth
 * confirming by hand before it is read as a regression.
 */
/**
 * The sandbox buyer, or skip the test.
 *
 * `test.skip(condition, reason)` throws when the condition holds, so nothing
 * after it runs — but TypeScript does not know that, and a cast at every call
 * site would be the same claim made three times. Made once here instead, where
 * the throw it depends on is in view.
 */
function signedInBuyer(): NonNullable<ReturnType<typeof payPalCredentials>> {
  const credentials = payPalCredentials()
  test.skip(
    credentials == null,
    "no PayPal sandbox buyer in NP_PAYPAL_EMAIL / NP_PAYPAL_PASSWORD",
  )
  return credentials as NonNullable<typeof credentials>
}

test.describe("paying with PayPal through Adyen", {
  tag: "@payment-sessions",
}, () => {
  /**
   * The handoff, and the only test here that needs no popup and takes no money.
   *
   * Worth having on its own: `collection` is republished on every `onSelect`,
   * and a stale `{ by: "gateway" }` left behind after switching back to the
   * card would leave a shopper with a permanently dead place button and a form
   * that fills in perfectly.
   */
  test("moves collection to PayPal's own button, and back", async ({
    checkout,
  }) => {
    test.setTimeout(120_000)

    await checkout.selectPaymentSetting("Adyen")
    await checkout.acceptTerms()

    // The card is what the Drop-in opens on, and it is ours to submit.
    await expect(checkout.placeButton).toBeEnabled()
    await expect(checkout.gatewayOwnsButtonHint).toBeHidden()

    await checkout.selectAdyenPayPal()

    // Two pay buttons are now on screen and that is the design: ours, disabled
    // with a reason the application words, and PayPal's inside the open row.
    await expect(checkout.placeButton).toBeDisabled()
    await expect(checkout.gatewayOwnsButtonHint).toBeVisible()

    await checkout.selectAdyenCard()

    await expect(checkout.placeButton).toBeEnabled()
    await expect(checkout.gatewayOwnsButtonHint).toBeHidden()
  })

  /**
   * The complaint that produced this test: PayPal's button, clicked before the
   * terms are accepted, looked broken.
   *
   * It is disabled — that is the gate working — but a disabled PayPal button
   * absorbs the click and says nothing, and "nothing happened" is
   * indistinguishable from a bug. The reason can only come from inside the
   * component, because the click is PayPal's and never reaches the application.
   *
   * Which also settles a question the types do not answer: whether `onClick`
   * fires at all on a button `actions.disable()` has disabled. If this test
   * passes, it does.
   */
  test("explains itself when clicked before the terms are accepted", async ({
    checkout,
  }) => {
    test.setTimeout(120_000)

    await checkout.selectPaymentSetting("Adyen")
    await checkout.selectAdyenPayPal()
    // Deliberately not accepting them.

    await checkout.adyenPayPalButton.click({ force: true })

    await expect(checkout.adyenError).toContainText(/terms/i, {
      timeout: 30_000,
    })
  })

  test("pays the whole order through PayPal's own button", async ({
    checkout,
    newPaymentsOrder,
  }) => {
    const credentials = signedInBuyer()
    test.setTimeout(240_000)

    await checkout.selectPaymentSetting("Adyen")
    // The terms are accepted **after** PayPal's buttons have rendered, which is
    // the order a real shopper works in and the one that found a bug: `onInit`
    // fires once per funding source, so re-enabling only the last one handed
    // over left PayPal dead while Venmo worked.
    await checkout.selectAdyenPayPal()
    await checkout.acceptTerms()

    // Nobody touches our button on this path. The order is placed because the
    // library saw an out-of-band collection, which is the same mechanism as a
    // 3DS redirect coming back: money taken, no click, order still to place.
    await checkout.payWithPayPal(credentials)
    await checkout.expectPlaced()

    await expectPaymentToCoverTheOrder(newPaymentsOrder, { sessions: 1 })
  })

  /**
   * The ordering `onClick` exists for.
   *
   * A gift card and PayPal split the order, and the cards have to be charged
   * *before* the popup opens — `beforeSubmit` runs after it is already open and
   * hangs it, and charging afterwards would leave a shopper who abandons PayPal
   * with credit spent on nothing. `onClick` is the only moment PayPal gives us,
   * and it is allowed to take as long as a round trip needs.
   *
   * Two sessions covering the total is therefore the whole assertion: it says
   * the gift card was charged, that PayPal was sized to the remainder, and that
   * the two together are the order.
   */
  test("charges a gift card first, then takes the rest through PayPal", async ({
    checkout,
    newPaymentsOrder,
    mintGiftCard,
  }) => {
    const credentials = signedInBuyer()
    test.setTimeout(240_000)

    const code = await mintGiftCard(13)
    const totalBefore = await checkout.totalAmount.innerText()
    await checkout.applyGiftCardSuccessfully(code)
    await expect(checkout.totalAmount).not.toHaveText(totalBefore)

    await checkout.selectPaymentSetting("Adyen")
    await checkout.selectAdyenPayPal()
    await checkout.acceptTerms()

    await checkout.payWithPayPal(credentials)
    await checkout.expectPlaced()

    await expect(checkout.paymentRecap).toContainText(code)
    await expectPaymentToCoverTheOrder(newPaymentsOrder, { sessions: 2 })
  })
})
