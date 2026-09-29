import {
  expect,
  expectPaymentToCoverTheOrder,
  test,
} from "../fixtures/newPaymentsPage"

/**
 * Klarna on the `payment_sessions` model, through the same Adyen Drop-in as the
 * card, PayPal and Google Pay.
 *
 * Klarna takes the **card's** route, not the wallets'. It has no fields and,
 * with the Drop-in's own pay button switched off, nothing to show; its submit
 * leaves the page for Klarna's, and a navigation needs no user gesture. So our
 * place button drives it, the gift cards are charged before it, and the shopper
 * comes back through the library's redirect resume — the same code a 3DS
 * redirect would run.
 *
 * Which is the other reason this suite exists: it is the only one that leaves
 * the page. Adyen's card challenges stay in an iframe, so without Klarna the
 * resume path — finishing an Adyen Session from the `sessionData` stored on the
 * Payment Session, with no Drop-in mounted — would have no end-to-end coverage
 * at all.
 *
 * Runs against Klarna's US playground, so the order has to be in a market and
 * currency the Adyen account has Klarna enabled for; `NP_*` provides one.
 */
test.describe("paying with Klarna through Adyen", {
  tag: "@payment-sessions",
}, () => {
  test("pays the whole order through Klarna's redirect, and places on the return", async ({
    checkout,
    newPaymentsOrder,
  }) => {
    test.setTimeout(180_000)

    await checkout.selectPaymentSetting("Adyen")
    await checkout.acceptTerms()
    await checkout.selectAdyenKlarna()

    // Ours stays the button that pays: Klarna is not a Gateway-Owned Button.
    await expect(checkout.placeButton).toBeEnabled()
    await expect(checkout.gatewayOwnsButtonHint).toBeHidden()

    await checkout.startPlaceOrder()
    await checkout.payWithKlarna()

    // Back on the checkout, and nobody clicks anything: the resume finishes
    // the Adyen Session and the place button takes the order the rest of the
    // way on its own.
    await checkout.page.waitForURL(/localhost:\d+\//, { timeout: 45_000 })
    await checkout.expectPlaced()

    await expectPaymentToCoverTheOrder(newPaymentsOrder, { sessions: 1 })
  })

  /**
   * The gift cards are charged **before** the shopper leaves for Klarna, so this
   * is the case where a redirect could strand money: a card already charged on
   * an order that has not come back yet.
   *
   * What it asserts is that it did not. The return places the order with the
   * gift card and Klarna together covering it exactly, and the card is charged
   * once — a second authorization on the return would show up as a third
   * session or a sum over the total.
   */
  test("pays the remainder through Klarna after a gift card", async ({
    checkout,
    newPaymentsOrder,
    mintGiftCard,
  }) => {
    test.setTimeout(240_000)

    const code = await mintGiftCard(13)
    const totalBefore = await checkout.totalAmount.innerText()
    await checkout.applyGiftCardSuccessfully(code)
    await expect(checkout.totalAmount).not.toHaveText(totalBefore)

    await checkout.selectPaymentSetting("Adyen")
    await checkout.acceptTerms()
    await checkout.selectAdyenKlarna()
    await checkout.startPlaceOrder()
    await checkout.payWithKlarna()

    await checkout.page.waitForURL(/localhost:\d+\//, { timeout: 45_000 })
    await checkout.expectPlaced()

    await expect(checkout.paymentRecap).toContainText(code)
    await expectPaymentToCoverTheOrder(newPaymentsOrder, { sessions: 2 })
  })
})
