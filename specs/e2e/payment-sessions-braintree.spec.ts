import {
  BRAINTREE_CHALLENGE_CARD,
  BRAINTREE_FRICTIONLESS_CARD,
  expect,
  expectPaymentToCoverTheOrder,
  raiseOrderTotalTo,
  readOrder,
  test,
} from "../fixtures/newPaymentsPage"

/**
 * Paying with a card on the `payment_sessions` model, through Braintree's Hosted
 * Fields and 3D Secure.
 *
 * The third card gateway, and the first whose charge happens server-side. The
 * browser only turns the card into a nonce — after 3DS, in Cardinal's modal —
 * and the money moves when Commerce Layer relays that nonce to Braintree inside
 * the Payment Authorization. So the click does more here than with Stripe or
 * Adyen: tokenize, authenticate, hand the nonce over and wait for the verdict.
 * The handoff to `<PlaceOrderButton>` is the same, and so are the terms gate and
 * the gift cards going first.
 *
 * Each test uses a different card or a different amount: Braintree's sandbox
 * rejects the same card for the same amount within a short window, and every
 * order these tests mint costs the same.
 */
test.describe("paying with Braintree on the payment_sessions model", {
  tag: "@payment-sessions",
}, () => {
  test("renders the Hosted Fields and hands the button its collection", async ({
    checkout,
  }) => {
    test.setTimeout(120_000)

    await checkout.selectPaymentSetting("Braintree")
    await checkout.acceptTerms()

    await expect(
      checkout.page.locator('iframe[name="braintree-hosted-field-number"]'),
    ).toBeVisible({ timeout: 30_000 })
    await expect(checkout.placeButton).toBeEnabled()
  })

  /**
   * The chain this suite exists for: tokenize, challenge, authorize, place.
   *
   * The challenge card, because the challenge is the step that sits between
   * the click and the money — Cardinal's modal opens on top of the checkout,
   * and the place only completes once the shopper has answered it.
   */
  test("pays the whole order with a card after a 3DS challenge", async ({
    checkout,
    newPaymentsOrder,
  }) => {
    test.setTimeout(180_000)

    await checkout.selectPaymentSetting("Braintree")
    await checkout.fillBraintreeCard(BRAINTREE_CHALLENGE_CARD)
    await checkout.acceptTerms()

    await checkout.placeButton.click()
    await checkout.completeBraintreeChallenge()
    await expect(checkout.paymentRecap).toBeVisible({ timeout: 60_000 })

    await expect(checkout.paymentInstrument).toContainText("1091")
    // Braintree spells the brand `VISA`; the icon set's file is `visa.svg`. A
    // URL built from the brand as given is a broken image.
    await expect
      .poll(
        async () =>
          await checkout.paymentInstrument
            .locator("img")
            .evaluate((img: HTMLImageElement) => img.naturalWidth),
        { message: "the card brand icon did not load", timeout: 15_000 },
      )
      .toBeGreaterThan(0)
    await expectPaymentToCoverTheOrder(newPaymentsOrder, { sessions: 1 })
  })

  test("pays without a challenge when the issuer does not ask for one", async ({
    checkout,
    newPaymentsOrder,
  }) => {
    test.setTimeout(180_000)

    await checkout.selectPaymentSetting("Braintree")
    await checkout.fillBraintreeCard(BRAINTREE_FRICTIONLESS_CARD)
    await checkout.acceptTerms()

    await checkout.placeOrder()

    await expect(checkout.paymentInstrument).toContainText("1000")
    await expectPaymentToCoverTheOrder(newPaymentsOrder, { sessions: 1 })
  })

  /**
   * A gift card and a card together. The gift card is charged before the
   * Hosted Fields are even tokenized, and Braintree is sized to the remainder
   * — which is also what 3DS is asked to authenticate.
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

    await checkout.selectPaymentSetting("Braintree")
    await checkout.fillBraintreeCard(BRAINTREE_CHALLENGE_CARD)
    await checkout.acceptTerms()

    await checkout.placeButton.click()
    await checkout.completeBraintreeChallenge()
    await expect(checkout.paymentRecap).toBeVisible({ timeout: 60_000 })

    await expect(checkout.giftCardRecap(code)).toBeVisible()
    await expectPaymentToCoverTheOrder(newPaymentsOrder, { sessions: 2 })
  })

  /**
   * A refusal from Braintree's processor: the sandbox declines any amount
   * between 2000.00 and 2999.99, whatever the card.
   *
   * What it proves is the verdict path. The authorization lands `declined`,
   * the component reports `failed`, and the button treats it as the refusal it
   * is: an error on the order, the order still pending, and the selection
   * gone — the session is burnt, so the shopper picks the method again and
   * gets a fresh one.
   */
  test("reports a declined card and leaves the order unplaced", async ({
    checkout,
    newPaymentsOrder,
  }) => {
    test.setTimeout(180_000)

    await raiseOrderTotalTo(newPaymentsOrder, 200_000)
    await checkout.page.reload()
    await checkout.waitForPaymentStep()

    await checkout.selectPaymentSetting("Braintree")
    await checkout.fillBraintreeCard(BRAINTREE_FRICTIONLESS_CARD)
    await checkout.acceptTerms()

    await checkout.placeButton.click()
    await expect(checkout.orderErrors).toContainText("declined", {
      timeout: 60_000,
    })
    await expect(checkout.paymentRecap).toBeHidden()

    const order = await readOrder(newPaymentsOrder)
    expect(order.status).not.toBe("placed")
    expect(
      (order.payment_sessions ?? []).every(
        (session) => session.status === "unpaid",
      ),
    ).toBe(true)
  })
})
