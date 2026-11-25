import {
  expect,
  expectPaymentToCoverTheOrder,
  expectWalletLinked,
  readOrder,
  test,
} from "../fixtures/newPaymentsPage"

/**
 * Paying with a card on the `payment_sessions` model, through Checkout.com's
 * card component.
 *
 * Checkout.com submits the payment itself, from the browser, when
 * `<PlaceOrderButton>` calls the component's `submit()`. The API learns of it
 * only once the payment id is written into the session, and the authorization
 * then reads that payment instead of submitting a new one.
 *
 * On the sandbox every payment comes back through a redirect: with 3DS on the
 * session, Checkout.com runs the challenge in its modal and then sends the
 * shopper to the session's `success_url` or `failure_url`, frictionless or not.
 * So what these tests drive is the return path — the payment recorded from the
 * URL on the next load, and the order placed out of band.
 */
test.describe("paying with Checkout.com on the payment_sessions model", {
  tag: "@payment-sessions",
}, () => {
  test("pays the whole order with a card, after a 3DS challenge", async ({
    checkout,
    newPaymentsOrder,
  }) => {
    test.setTimeout(180_000)

    await checkout.selectPaymentSetting("Checkout.com")
    await checkout.fillCheckoutComCard()
    await checkout.acceptTerms()

    await checkout.startPlaceOrder()
    await checkout.submitCheckoutComChallenge()
    await checkout.expectPlaced()

    await expect(checkout.paymentInstrument).toContainText("4242")
    await expectPaymentToCoverTheOrder(newPaymentsOrder, { sessions: 1 })
  })

  /**
   * The gift card goes first, before the card component submits: the reason
   * the card component was chosen over Flow, whose wallets would have taken
   * the money with their own buttons. Two sessions covering the total says the
   * gift card was charged, that Checkout.com was sized to the remainder, and
   * that the redirect in between lost neither.
   */
  test("splits the order between a gift card and a card", async ({
    checkout,
    newPaymentsOrder,
    mintGiftCard,
  }) => {
    test.setTimeout(180_000)

    const code = await mintGiftCard(13)
    const totalBefore = await checkout.totalAmount.innerText()
    await checkout.applyGiftCardSuccessfully(code)
    await expect(checkout.totalAmount).not.toHaveText(totalBefore)

    await checkout.selectPaymentSetting("Checkout.com")
    await checkout.fillCheckoutComCard()
    await checkout.acceptTerms()

    await checkout.startPlaceOrder()
    await checkout.submitCheckoutComChallenge()
    await checkout.expectPlaced()

    await expect(checkout.giftCardRecap(code)).toBeVisible()
    await expectPaymentToCoverTheOrder(newPaymentsOrder, { sessions: 2 })
  })

  /**
   * A failed challenge sends the shopper to the `failure_url`. Nothing is
   * recorded on the session — a declined payment would only fail its
   * authorization — and the order stays where it was, open for another try.
   */
  test("leaves the order unplaced when the 3DS challenge fails", async ({
    checkout,
    newPaymentsOrder,
  }) => {
    test.setTimeout(180_000)

    await checkout.selectPaymentSetting("Checkout.com")
    await checkout.fillCheckoutComCard()
    await checkout.acceptTerms()

    await checkout.startPlaceOrder()
    await checkout.submitCheckoutComChallenge("not-the-password", 3)

    await expect(checkout.orderErrors).toContainText(/not completed/i, {
      timeout: 60_000,
    })
    await expect(checkout.paymentRecap).not.toBeVisible()

    const order = await readOrder(newPaymentsOrder)
    expect(order.status).not.toBe("placed")
    for (const session of order.payment_sessions ?? []) {
      expect(session.client_data?.payment_method).toBeUndefined()
    }
  })

  test.describe("for a signed-in customer", () => {
    // A fresh customer per run: every run stores one more card, and a wallet
    // linked to a session cannot be removed.
    test.use({ customerOrder: "fresh" })

    /**
     * Not yet: the session vaults and Checkout.com stores the card, but no
     * `payment_wallet` is linked to the session when the payment comes back
     * through a 3DS redirect, which on the sandbox is every payment. Failed
     * on 2026-11-25. Re-enable once the wallet is linked on that path.
     */
    test.fixme("stores a card the shopper chose to save, as a wallet", async ({
      checkout,
      newPaymentsOrder,
    }) => {
      test.setTimeout(240_000)

      await checkout.selectPaymentSetting("Checkout.com")
      await checkout.chooseToSaveCard(checkout.checkoutComForm)
      await checkout.fillCheckoutComCard()
      await checkout.acceptTerms()

      await checkout.startPlaceOrder()
      await checkout.submitCheckoutComChallenge()
      await checkout.expectPlaced()

      await expectPaymentToCoverTheOrder(newPaymentsOrder, { sessions: 1 })
      await expectWalletLinked(
        newPaymentsOrder,
        "payment_setting_checkout_coms",
      )
    })
  })
})
