import {
  braintreePayPalCredentials,
  expect,
  expectPaymentToCoverTheOrder,
  readOrder,
  test,
} from "../fixtures/newPaymentsPage"

function signedInBuyer(): NonNullable<
  ReturnType<typeof braintreePayPalCredentials>
> {
  const credentials = braintreePayPalCredentials()
  test.skip(
    credentials == null,
    "no PayPal sandbox buyer in PAYMENT_SETTINGS_BRAINTREE_PAYPAL_* or PAYMENT_SETTINGS_PAYPAL_*",
  )
  return credentials as NonNullable<typeof credentials>
}

/**
 * Paying with PayPal through Braintree, on the `payment_sessions` model.
 *
 * Commerce Layer takes a PayPal nonce exactly as it takes a card's — same
 * Payment Session, same `client_data.payment_method_id`, same authorization —
 * so what is under test here is the browser half: PayPal's own button, the
 * terms gate and the gift cards on its click, and the order placed without a
 * click of ours once PayPal has approved.
 *
 * The card fields stay live beside the button, so unlike PayPal through Adyen
 * the place button is never disabled for it.
 */
test.describe("paying with PayPal through Braintree", {
  tag: "@payment-sessions",
}, () => {
  test("renders PayPal's button beside the card fields", async ({
    checkout,
  }) => {
    test.setTimeout(120_000)

    await checkout.selectPaymentSetting("Braintree")
    await checkout.acceptTerms()

    await expect(checkout.braintreePayPalFrame).toBeVisible({
      timeout: 30_000,
    })
    await expect(
      checkout.page.locator('iframe[name="braintree-hosted-field-number"]'),
    ).toBeVisible()
    // Both routes are live: the card through ours, PayPal through its own.
    await expect(checkout.placeButton).toBeEnabled()
    await expect(checkout.gatewayOwnsButtonHint).toBeHidden()
  })

  test("explains itself when clicked before the terms are accepted", async ({
    checkout,
  }) => {
    test.setTimeout(120_000)

    await checkout.selectPaymentSetting("Braintree")
    await expect(checkout.braintreePayPalFrame).toBeVisible({
      timeout: 30_000,
    })

    await checkout.braintreePayPalButton.click({ force: true })

    await expect(checkout.braintreePayPalError).toContainText(/terms/i, {
      timeout: 30_000,
    })
  })

  test("pays the whole order through PayPal's own button", async ({
    checkout,
    newPaymentsOrder,
  }) => {
    const credentials = signedInBuyer()
    test.setTimeout(240_000)

    await checkout.selectPaymentSetting("Braintree")
    await checkout.acceptTerms()
    await expect(checkout.braintreePayPalFrame).toBeVisible({
      timeout: 30_000,
    })

    await checkout.payWithPayPal(credentials, checkout.braintreePayPalButton)
    await checkout.expectPlaced()

    await expectPaymentToCoverTheOrder(newPaymentsOrder, { sessions: 1 })
    // Commerce Layer fills the instrument from Braintree's PayPal snapshot.
    const placed = await readOrder(newPaymentsOrder)
    const instrument = placed.payment_sessions?.[0]?.payment_instrument as
      | { account_email?: string }
      | undefined
    expect(instrument?.account_email).toBe(credentials.email)
    // Braintree names no method on the instrument; the recap still says PayPal.
    await expect(checkout.paymentInstrument).toHaveText("PayPal")
  })

  /**
   * The gift card is charged on PayPal's click, before the popup goes on — the
   * same moment as PayPal through Adyen — and Braintree is sized to the rest.
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

    await checkout.selectPaymentSetting("Braintree")
    await checkout.acceptTerms()
    await expect(checkout.braintreePayPalFrame).toBeVisible({
      timeout: 30_000,
    })

    await checkout.payWithPayPal(credentials, checkout.braintreePayPalButton)
    await checkout.expectPlaced()

    await expect(checkout.giftCardRecap(code)).toBeVisible()
    await expectPaymentToCoverTheOrder(newPaymentsOrder, { sessions: 2 })
  })
})
