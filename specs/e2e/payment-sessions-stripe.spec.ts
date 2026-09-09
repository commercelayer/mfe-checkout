import {
  expect,
  expectPaymentToCoverTheOrder,
  test,
} from "../fixtures/newPaymentsPage"

/**
 * Paying with a card on the `payment_sessions` model, through Stripe's Payment
 * Element.
 *
 * The second gateway, and the one that shows whether the card mechanism was
 * built for cards or for Adyen. It arrives on the same path: the Element is
 * inert until something confirms it, so `<PlaceOrderButton>` is the pay button,
 * the privacy-and-terms gate stays in front of the payment, and the gift cards
 * are charged before it. Nothing about the handoff changed to accommodate it.
 *
 * What differs is what the Element offers. Its methods come from the
 * PaymentIntent, Commerce Layer sends no `payment_method_types`, and the intent
 * arrives with `automatic_payment_methods: { allow_redirects: "always" }` — so
 * whatever the Stripe Dashboard has enabled is on offer, and some of it
 * redirects. There is no client-side filter for that; the Dashboard is the lever.
 */
test.describe("paying with Stripe on the payment_sessions model", {
  tag: "@payment-sessions",
}, () => {
  test("renders the Payment Element and hands the button its collection", async ({
    checkout,
  }) => {
    test.setTimeout(120_000)

    await checkout.selectPaymentSetting("Stripe")
    await checkout.acceptTerms()

    // The Element lives in an iframe Stripe owns, so what is asserted is that
    // it arrived — its contents are not ours to reach into.
    await expect(checkout.stripeElement).toBeVisible({ timeout: 30_000 })

    // Ours to collect through, unlike a wallet's own button: the place button
    // is live rather than disabled with a reason.
    await expect(checkout.placeButton).toBeEnabled()
    await expect(checkout.gatewayOwnsButtonHint).toBeHidden()
  })

  /**
   * The chain this suite exists for: confirm, then place.
   *
   * A frictionless card, because what is under test is the mapping from
   * Stripe's outcome to the handoff's. The intent is created with
   * `capture_method: manual`, so a successful authorization lands on
   * `requires_capture` and never reaches `succeeded` — reading only the latter
   * as success is the mistake this catches.
   */
  test("pays the whole order with a card", async ({
    checkout,
    newPaymentsOrder,
  }) => {
    test.setTimeout(180_000)

    await checkout.selectPaymentSetting("Stripe")
    await checkout.fillStripeCard()
    await checkout.acceptTerms()

    await checkout.placeOrder()

    await expectPaymentToCoverTheOrder(newPaymentsOrder, { sessions: 1 })
  })

  /**
   * A gift card and a card together, on the gateway that was not there when the
   * charge order was decided.
   *
   * The gift cards go first, before `confirmPayment` — the ordering the card
   * path established and the reason `<PlaceOrderButton>` owns the submit. Two
   * sessions covering the total is the whole assertion: it says the gift card
   * was charged, that Stripe was sized to the remainder, and that the two
   * together are the order.
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

    await checkout.selectPaymentSetting("Stripe")
    await checkout.fillStripeCard()
    await checkout.acceptTerms()

    await checkout.placeOrder()

    await expect(checkout.paymentRecap).toContainText(code)
    await expectPaymentToCoverTheOrder(newPaymentsOrder, { sessions: 2 })
  })
})
