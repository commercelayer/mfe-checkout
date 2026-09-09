import {
  ADYEN_3DS_PASSWORD,
  expect,
  expectPaymentToCoverTheOrder,
  readOrder,
  test,
} from "../fixtures/newPaymentsPage"

/**
 * Paying with a card on the `payment_sessions` model, through Adyen's
 * client-side Drop-in.
 *
 * The card is the first payment setting where the shopper can *fail* — a
 * manual payment and a gift card either work or were never offered — and the
 * failure is not the end of the checkout, it is the ordinary middle of one.
 * These tests exist for that branch. The happy path is here mainly so a failure
 * in the interesting test can be read: if the challenge cannot be completed at
 * all, the regression below tells you nothing.
 *
 * Every one of these drives Adyen's real sandbox. Two things have to be true
 * of the environment or they fail for reasons that are not the code's:
 *
 * - the Adyen client key must authorise this origin (scheme, host **and**
 *   port — which is why this suite serves on 3000 rather than Playwright's own
 *   4000, and why `E2E_PORT` is not free to change);
 * - `NP_*` must point at an organization whose market offers an Adyen payment
 *   setting with a `public_key`.
 *
 * A rejected origin arrives as a generic network error, indistinguishable from
 * a blip, so an unexplained failure to load the Drop-in is worth checking there
 * first.
 */
test.describe("paying with Adyen on the payment_sessions model", {
  tag: "@payment-sessions",
}, () => {
  test("pays the whole order with a card, completing the 3DS challenge", async ({
    checkout,
    newPaymentsOrder,
  }) => {
    test.setTimeout(180_000)

    await checkout.selectPaymentSetting("Adyen")
    await checkout.fillAdyenCard()
    await checkout.acceptTerms()

    // The Drop-in's own Pay button is suppressed and this one drives it, which
    // is what keeps the terms gate in front of every payment.
    await checkout.startPlaceOrder()
    await checkout.submitThreeDSChallenge(ADYEN_3DS_PASSWORD)
    await checkout.expectPlaced()

    await expectPaymentToCoverTheOrder(newPaymentsOrder, { sessions: 1 })
  })

  /**
   * Switching away and back, which used to be a one-way door.
   *
   * Selecting a setting creates a Payment Session and the selection *is* the
   * newest session — but a session already on the order was adopted rather than
   * replaced, and adopting changes no timestamp. So the first Adyen session
   * stayed adoptable, nothing was created, the bank transfer session stayed the
   * newest, and the radio never came back to Adyen. Clicking again did nothing
   * again. Found on a real order carrying two unpaid sessions nine seconds
   * apart; not Adyen-specific — any `A → B → A` got stuck on `B`.
   *
   * `selectPaymentSetting` waits for the clicked radio to be checked, so the
   * third call is the whole assertion. The Drop-in is asserted too, because
   * that is what the shopper is actually waiting to see.
   */
  test("comes back when the shopper switches away and changes their mind", async ({
    checkout,
    newPaymentsOrder,
  }) => {
    test.setTimeout(120_000)

    await checkout.selectPaymentSetting("Adyen")
    await expect(checkout.adyenDropin).toBeVisible({ timeout: 30_000 })

    await checkout.selectPaymentSetting("Wire Transfer")
    await expect(checkout.adyenDropin).toBeHidden()

    await checkout.selectPaymentSetting("Adyen")
    await expect(checkout.adyenDropin).toBeVisible({ timeout: 30_000 })

    // The mechanism, not only the symptom. Switching back has to *create* a
    // session, because the selection is the newest one and adopting the first
    // Adyen session again would move nothing — and each switch has to clear the
    // one it supersedes, or the order accumulates a session per setting the
    // shopper ever tried. Both rules land on the same number: exactly one
    // non-gift-card session, belonging to Adyen.
    const order = await readOrder(newPaymentsOrder)
    const sessions = (order.payment_sessions ?? []).filter(
      (session) => session.gift_card_code == null,
    )
    expect(sessions).toHaveLength(1)
    const newest = sessions.reduce((latest, session) =>
      Date.parse(session.created_at ?? "") >=
      Date.parse(latest.created_at ?? "")
        ? session
        : latest,
    )
    expect(newest.payment_setting?.type).toBe("payment_setting_adyens")
    // And it is sized for the whole order, so placing with it would work.
    expect(newest.amount_cents).toBe(order.total_amount_with_taxes_cents)
  })

  /**
   * The regression this suite was written for.
   *
   * An earlier version refunded every gift card it had charged as soon as the
   * card was refused, on the reasoning that a refusal is a verdict and the
   * rollback is therefore safe. It is safe, and it was wrong: the shopper
   * simply tries again, and their credit is gone — unrecoverably, because
   * nothing more may be applied once anything is authorized. The first real
   * 3DS failure left a shopper charged for the remainder with their gift cards
   * refunded and $18 outstanding.
   *
   * So the assertion after the failure is that **nothing was given back**, and
   * the assertion after the retry is that the same cards paid for the order.
   * The session count is part of it: the burnt Adyen session must really be
   * gone, or a fourth, unpaid session would be sitting on a placed order.
   */
  test("keeps the gift cards applied when the challenge fails, and pays on a second attempt", async ({
    checkout,
    newPaymentsOrder,
    mintGiftCard,
  }) => {
    test.setTimeout(240_000)

    const first = await mintGiftCard(13)
    const second = await mintGiftCard(5)
    await checkout.applyGiftCardSuccessfully(first)
    await checkout.applyGiftCardSuccessfully(second)
    const totalWithCards = await checkout.totalAmount.innerText()

    await checkout.selectPaymentSetting("Adyen")
    await checkout.fillAdyenCard()
    await checkout.acceptTerms()
    await checkout.startPlaceOrder()

    // Fail it. The gift cards have already been charged at this point — they go
    // first, so that a refused card never leaves them charged *after* it.
    await checkout.submitThreeDSChallenge("not-the-password")

    // The shopper is told, and this is more fragile than it looks: `<Errors>`
    // matches on the error's `resource`, so tagging a gateway refusal anything
    // other than `orders` makes it vanish from the only outlet consumers mount.
    await expect(checkout.orderErrors).toContainText(/refused/i, {
      timeout: 60_000,
    })

    // Nothing was given back, and the amount owed has not moved.
    await expect(checkout.giftCardRow(first)).toBeVisible()
    await expect(checkout.giftCardRow(second)).toBeVisible()
    await expect(checkout.totalAmount).toHaveText(totalWithCards)

    // The burnt Payment Session is deleted and nothing replaces it, so the
    // shopper picks the method again — which is also where they would see a
    // changed amount if they had chosen to take a card back instead.
    await checkout.expectNoPaymentSettingSelected()

    await checkout.selectPaymentSetting("Adyen")
    await checkout.fillAdyenCard()
    await checkout.acceptTerms()
    await checkout.startPlaceOrder()
    await checkout.submitThreeDSChallenge(ADYEN_3DS_PASSWORD)
    await checkout.expectPlaced()

    await expect(checkout.paymentRecap).toContainText(first)
    await expect(checkout.paymentRecap).toContainText(second)
    await expectPaymentToCoverTheOrder(newPaymentsOrder, { sessions: 3 })
  })

  /**
   * Giving the money back is the shopper's to ask for, and this is the control
   * that does it.
   *
   * The card here is already **charged** — the failed attempt above authorized
   * and captured it — so "remove" cannot mean delete: the API refuses to delete
   * a session with transactions attached. It means refund, and the row goes
   * only once the session reads `refunded`, which is also what puts the amount
   * back into what is owed.
   */
  test("refunds a charged gift card when it is removed after a failed payment", async ({
    checkout,
    newPaymentsOrder,
    mintGiftCard,
  }) => {
    test.setTimeout(180_000)

    const code = await mintGiftCard(13)
    const totalBefore = await checkout.totalAmount.innerText()
    await checkout.applyGiftCardSuccessfully(code)
    await expect(checkout.totalAmount).not.toHaveText(totalBefore)

    await checkout.selectPaymentSetting("Adyen")
    await checkout.fillAdyenCard()
    await checkout.acceptTerms()
    await checkout.startPlaceOrder()
    await checkout.submitThreeDSChallenge("not-the-password")

    await expect(checkout.orderErrors).toContainText(/refused/i, {
      timeout: 60_000,
    })
    // Still there, and now charged rather than merely applied.
    await expect(checkout.giftCardRow(code)).toBeVisible()

    await checkout.removeGiftCard(code)

    // The full amount is owed again, and the API agrees: the session is
    // `refunded`, not deleted — a charged one cannot be.
    await expect(checkout.totalAmount).toHaveText(totalBefore)

    const order = await readOrder(newPaymentsOrder)
    const giftCards = (order.payment_sessions ?? []).filter(
      (session) => session.gift_card_code === code,
    )
    expect(giftCards).toHaveLength(1)
    expect(giftCards[0]?.status).toBe("refunded")
  })
})
