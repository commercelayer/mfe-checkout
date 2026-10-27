import {
  expect,
  expectPaymentToCoverTheOrder,
  expectWalletLinked,
  payPalCredentials,
  readOrder,
  test,
} from "../fixtures/newPaymentsPage"

/** The PayPal payment setting, by the name it carries in the organization. */
const PAYPAL = "Pay with Paypal"

function signedInBuyer(): NonNullable<ReturnType<typeof payPalCredentials>> {
  const credentials = payPalCredentials()
  test.skip(
    credentials == null,
    "no PayPal sandbox buyer in PAYMENT_SETTINGS_PAYPAL_*",
  )
  return credentials as NonNullable<typeof credentials>
}

/**
 * Paying with PayPal as a payment setting of its own — PayPal's Orders API
 * through Commerce Layer — on the `payment_sessions` model.
 *
 * Commerce Layer creates the PayPal order with the Payment Session, so what is
 * under test is the browser half: PayPal's v6 button opening its window on that
 * order, the terms gate and the gift cards inside PayPal's click, and the order
 * placed without a click of ours once the approval has been authorized.
 *
 * PayPal's button is the only way to pay this setting, so unlike Braintree the
 * place button stands aside while it is selected.
 */
test.describe("paying with the PayPal payment setting", {
  tag: "@payment-sessions",
}, () => {
  test("hands the place button over to PayPal's own button", async ({
    checkout,
  }) => {
    test.setTimeout(120_000)

    await checkout.selectPaymentSetting(PAYPAL)
    await expect(checkout.payPalSettingButton).toBeVisible({ timeout: 30_000 })
    await expect(checkout.gatewayOwnsButtonHint).toBeVisible()
    await expect(checkout.placeButton).toBeDisabled()
  })

  test("explains itself when clicked before the terms are accepted", async ({
    checkout,
  }) => {
    test.setTimeout(120_000)

    await checkout.selectPaymentSetting(PAYPAL)
    await expect(checkout.payPalSettingButton).toBeVisible({ timeout: 30_000 })

    await checkout.payPalSettingButton.click({ force: true })

    await expect(checkout.payPalSettingError).toContainText(/terms/i, {
      timeout: 30_000,
    })
  })

  test("pays the whole order through PayPal's own button", async ({
    checkout,
    newPaymentsOrder,
  }) => {
    const credentials = signedInBuyer()
    test.setTimeout(240_000)

    await checkout.selectPaymentSetting(PAYPAL)
    await checkout.acceptTerms()
    await expect(checkout.payPalSettingButton).toBeVisible({ timeout: 30_000 })

    await checkout.payWithPayPal(credentials, checkout.payPalSettingButton)
    await checkout.expectPlaced()

    await expectPaymentToCoverTheOrder(newPaymentsOrder, { sessions: 1 })
    // Commerce Layer fills the instrument from the PayPal order's payer.
    const placed = await readOrder(newPaymentsOrder)
    const instrument = placed.payment_sessions?.[0]?.payment_instrument as
      | { account_email?: string }
      | undefined
    expect(instrument?.account_email).toBe(credentials.email)
    // PayPal names no method on the instrument; the recap still says PayPal.
    await expect(checkout.paymentInstrument).toHaveText("PayPal")
  })

  /**
   * The gift card is charged inside PayPal's click, while its window opens, and
   * the PayPal order Commerce Layer created is for the remainder only.
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

    await checkout.selectPaymentSetting(PAYPAL)
    await checkout.acceptTerms()
    await expect(checkout.payPalSettingButton).toBeVisible({ timeout: 30_000 })

    await checkout.payWithPayPal(credentials, checkout.payPalSettingButton)
    await checkout.expectPlaced()

    await expect(checkout.giftCardRecap(code)).toBeVisible()
    await expectPaymentToCoverTheOrder(newPaymentsOrder, { sessions: 2 })
  })

  /**
   * A customer of its own: a stored PayPal account cannot be removed by any
   * token once a payment has used it, so on the shared customer every run would
   * leave one behind for good.
   */
  test.describe("saving the account", () => {
    test.use({ customerOrder: "fresh" })

    test("stores the PayPal account the shopper chose to save, as a wallet", async ({
      checkout,
      newPaymentsOrder,
    }) => {
      const credentials = signedInBuyer()
      test.setTimeout(240_000)

      await checkout.selectPaymentSetting(PAYPAL)
      // The consent is this application's: PayPal's window asks to save only
      // once the session has — and ticking it replaces the session.
      await checkout.chooseToSaveCard(checkout.payPalSettingButton)
      await checkout.acceptTerms()

      await checkout.payWithPayPal(credentials, checkout.payPalSettingButton)
      await checkout.expectPlaced()

      await expectPaymentToCoverTheOrder(newPaymentsOrder, { sessions: 1 })
      await expectWalletLinked(newPaymentsOrder, "payment_setting_paypals")
    })
  })
})
