import {
  expect,
  expectPaymentToCoverTheOrder,
  test,
} from "../fixtures/newPaymentsPage"

/**
 * Google Pay through Checkout.com's own component, beside the card form.
 *
 * A headless browser cannot complete a Google Pay payment — the sheet wants a
 * Google account — so what is covered is everything around it.
 *
 * Headless on purpose, unlike the rest of the suite. In a headed Chromium,
 * Google Pay opens in the browser's own payment sheet, which automation cannot
 * reach or close. Headless, it falls back to a popup on Google's domain, which
 * it can.
 */
test.use({ headless: true })

test.describe("paying with Google Pay through Checkout.com on the payment_sessions model", {
  tag: "@payment-sessions",
}, () => {
  test("offers Google Pay beside the card form", async ({ checkout }) => {
    test.setTimeout(120_000)

    await checkout.selectPaymentSetting("Checkout.com")

    await expect(
      checkout.checkoutComGooglePay.locator("iframe, button").first(),
    ).toBeVisible({ timeout: 30_000 })
    await expect(checkout.checkoutComForm).toBeVisible()
  })

  test("asks for the terms before Google Pay's sheet opens", async ({
    checkout,
  }) => {
    test.setTimeout(120_000)

    await checkout.selectPaymentSetting("Checkout.com")
    const popup = checkout.page
      .context()
      .waitForEvent("page", { timeout: 5_000 })
      .catch(() => null)
    await checkout.clickCheckoutComGooglePay()

    await expect(checkout.checkoutComGooglePayError).toBeVisible()
    expect(await popup).toBeNull()
  })

  /**
   * Checkout.com raises nothing when the shopper closes Google Pay's sheet
   * without paying. A payment lock taken on the click would never be let go,
   * and the card form behind it could not pay: this is the test for that.
   */
  test("pays by card after the shopper closed Google Pay's sheet", async ({
    checkout,
    newPaymentsOrder,
  }) => {
    test.setTimeout(180_000)

    await checkout.selectPaymentSetting("Checkout.com")
    await checkout.acceptTerms()

    const sheet = await checkout.openCheckoutComGooglePaySheet()
    await sheet.close()

    await checkout.fillCheckoutComCard()
    await checkout.startPlaceOrder()
    await checkout.submitCheckoutComChallenge()
    await checkout.expectPlaced()

    await expectPaymentToCoverTheOrder(newPaymentsOrder, { sessions: 1 })
  })
})
