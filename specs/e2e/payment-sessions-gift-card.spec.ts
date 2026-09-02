import {
  expect,
  expectPaymentToCoverTheOrder,
  test,
} from "../fixtures/newPaymentsPage"

/**
 * What the payment step has to keep true while the shopper changes their mind.
 *
 * These are the tests that stop a new payment setting from quietly breaking the
 * gift card flow. Placing an order proves the happy path once; this file proves
 * the invariant that survives every combination — **a gift card changing clears
 * the method selection** — which is client-side logic in
 * `CheckoutPaymentSessions.tsx` and the library's gift card components, not
 * something the API enforces.
 *
 * The reason it has to hold: applying or removing a gift card moves what is
 * left to pay, so the session covering the difference is deleted along with it.
 * A radio left looking selected would describe a session that no longer exists,
 * and the place button would be live on an order nothing is paying for.
 */
test.describe("gift cards on the payment_sessions model", {
  tag: "@payment-sessions",
}, () => {
  const WIRE = "Wire Transfer Payment Setting"

  /**
   * The full round trip the flow has to survive: pay part with a card, change
   * your mind, put it back, and still end up with a correctly paid order.
   *
   * The same code is applied twice on purpose. Nothing is charged until the
   * order is placed, so removing a card must leave it spendable — if this step
   * fails with "doesn't match any active gift card", the removal is taking the
   * shopper's balance rather than releasing it.
   */
  test("removing a gift card clears the selection, and re-adding it still places", async ({
    checkout,
    newPaymentsOrder,
    mintGiftCard,
  }) => {
    const code = await mintGiftCard(10)

    await checkout.applyGiftCardSuccessfully(code)
    await checkout.selectPaymentSetting(WIRE)
    await checkout.acceptTerms()
    await expect(checkout.placeButton).toBeEnabled()

    await checkout.removeGiftCard(code)

    // The method session went with the card, so nothing is paying the order.
    await checkout.expectNoPaymentSettingSelected()
    await expect(checkout.placeButton).toBeDisabled()

    await checkout.applyGiftCardSuccessfully(code)
    await checkout.selectPaymentSetting(WIRE)
    await checkout.placeOrder()

    await expectPaymentToCoverTheOrder(newPaymentsOrder, { sessions: 2 })
  })

  /**
   * The same invariant reached from the other side. Selecting the method first
   * sizes its session to the full total; applying a card then makes that amount
   * wrong, so the session is deleted and the shopper has to pick again.
   *
   * Worth its own test because the two orders of operation take different code
   * paths — one creates a session against a discounted remainder, the other
   * invalidates a session that already existed.
   */
  test("applying a gift card clears a method selected before it", async ({
    checkout,
    mintGiftCard,
  }) => {
    const code = await mintGiftCard(10)

    await checkout.selectPaymentSetting(WIRE)
    await checkout.acceptTerms()

    await checkout.applyGiftCardSuccessfully(code)

    await checkout.expectNoPaymentSettingSelected()
    await expect(checkout.placeButton).toBeDisabled()
  })

  /**
   * An unknown, expired or spent code is refused before anything is written to
   * the order, so `<Errors resource="orders">` never sees it — the gift card box
   * has its own outlet. A control that silently does nothing is the failure
   * mode this guards against, so the assertion is that *something* is said, not
   * what: the wording is the API's and is free to change.
   */
  test("refuses an unknown gift card code with a message", async ({
    checkout,
  }) => {
    await checkout.applyGiftCard("NOTAREALCODE")

    await expect(checkout.giftCardError).not.toBeEmpty()
    await expect(checkout.giftCardRows).toHaveCount(0)
    await expect(checkout.placeButton).toBeDisabled()
  })
})
