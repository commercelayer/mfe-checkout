import type { NewPaymentsOrder } from "../fixtures/newPaymentsPage"
import {
  ADYEN_3DS_PASSWORD,
  expect,
  expectPaymentToCoverTheOrder,
  readOrder,
  readSessionWallet,
  test,
} from "../fixtures/newPaymentsPage"

/**
 * Saving a card on the `payment_sessions` model, through `vaulting` on the
 * Payment Session.
 *
 * Nothing about the wallet is written from the checkout. A session created with
 * `vaulting: true` asks Commerce Layer to store the card during the charge, and
 * Commerce Layer links the `payment_wallet` to the session itself — from the
 * confirmed PaymentIntent on Stripe, from Adyen's `RECURRING_CONTRACT` webhook
 * on Adyen. So what these tests prove is the asking, and that the answer
 * arrives: the wallet is read back off the session.
 *
 * Who gives consent differs, and that is the design. Adyen's Drop-in renders
 * its own checkbox once the session asks for consent; Stripe's Element, driven
 * by the PaymentIntent's secret, has none, so the checkbox is this
 * application's — and ticking it replaces the session, because `vaulting` is
 * fixed at creation.
 *
 * A signed-in customer throughout: a wallet belongs to a customer, and the
 * library never asks on a guest's behalf.
 */
test.describe("saving a card on the payment_sessions model", {
  tag: "@payment-sessions",
}, () => {
  test.use({ customerOrder: true })

  /**
   * Skipped because every run leaves a wallet behind that nothing can remove.
   * Each confirmation of a typed card creates a new Stripe PaymentMethod, and
   * Commerce Layer deduplicates wallets on the `pm_` token rather than on the
   * card's fingerprint, so the same test card becomes one more wallet per run.
   * A wallet linked to a payment session cannot be deleted (423, the
   * association is `restrict_with_exception`), and a customer token may not
   * send `_cancel` (it is prohibited for sales-channel tokens). Adyen does not
   * have the problem: the same card comes back with the same stored token and
   * the existing wallet is reused.
   *
   * Passed on 2026-09-29. Re-enable once Commerce Layer deduplicates Stripe
   * wallets by fingerprint, or lets a customer retire a wallet in use. To run
   * it by hand, drop the `.skip` and accept one more wallet on the test
   * customer.
   */
  test.skip("stores a Stripe card the shopper chose to save, as a wallet", async ({
    checkout,
    newPaymentsOrder,
  }) => {
    test.setTimeout(180_000)

    await checkout.selectPaymentSetting("Stripe")
    await checkout.chooseToSaveCard()
    await checkout.fillStripeCard()
    await checkout.acceptTerms()
    await checkout.placeOrder()

    await expectPaymentToCoverTheOrder(newPaymentsOrder, { sessions: 1 })
    await expectWalletLinked(newPaymentsOrder, "payment_setting_stripes")
  })

  test("stores an Adyen card the shopper ticked in the Drop-in, as a wallet", async ({
    checkout,
    newPaymentsOrder,
  }) => {
    test.setTimeout(240_000)

    await checkout.selectPaymentSetting("Adyen")
    await checkout.selectAdyenNewCard()
    await checkout.fillAdyenCard()
    // Rendered by Adyen only because the session asked for consent: its
    // presence is the proof the library sent `vaulting`.
    await checkout.saveAdyenCard()
    await checkout.acceptTerms()

    await checkout.startPlaceOrder()
    await checkout.submitThreeDSChallenge(ADYEN_3DS_PASSWORD)
    await checkout.expectPlaced()

    await expectPaymentToCoverTheOrder(newPaymentsOrder, { sessions: 1 })
    await expectWalletLinked(newPaymentsOrder, "payment_setting_adyens")
  })
})

/**
 * The paying session vaulted, and Commerce Layer linked a wallet to it.
 *
 * Polled because Adyen's wallet arrives on a webhook some seconds after the
 * payment; Stripe's is usually there already.
 */
async function expectWalletLinked(
  order: NewPaymentsOrder,
  settingType: string,
): Promise<void> {
  const placed = await readOrder(order)
  const session = (placed.payment_sessions ?? []).find(
    (candidate) => candidate.payment_setting?.type === settingType,
  )
  expect(session, `no ${settingType} session on the order`).toBeDefined()
  const sessionId = session?.id as string

  expect((await readSessionWallet(order, sessionId)).vaulting).toBe(true)
  await expect
    .poll(async () => (await readSessionWallet(order, sessionId)).walletId, {
      message: "Commerce Layer linked no payment_wallet to the session",
      timeout: 90_000,
      intervals: [2_000, 5_000],
    })
    .toBeTruthy()
}
