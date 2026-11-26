import type { Locator, Page } from "@playwright/test"
import { expect, test } from "../fixtures/newPaymentsPage"

/**
 * Google Pay through Braintree, on the `payment_sessions` model.
 *
 * Its own button beside the card fields, like Apple Pay through Braintree, and
 * the same split as Google Pay through Adyen: the terms gate on the click,
 * synchronous, because `loadPaymentData()` has to run inside the click's user
 * gesture, and the gift cards on `onPaymentAuthorized`, inside Google's sheet.
 *
 * Braintree's sandbox merchant pays in Google's `TEST` environment, which
 * needs no Google merchant ID, so the button renders here. On a production
 * merchant it renders nothing until the payment setting carries one.
 *
 * **What is not covered, and why** — the reason the Adyen suite gives:
 * completing a payment needs a signed-in Google account, and Playwright's
 * Chromium has no profile. These tests stop where the sheet opens, which is
 * the assertion that the gesture survived.
 */

/** Google's button, drawn into the container this application names. */
function googlePayButton(page: Page): Locator {
  return page.locator(".braintree-google-pay-button button").first()
}

/** What Braintree's Google Pay reports about itself — the terms gate, a gift card. */
function googlePayError(page: Page): Locator {
  return page.locator("[data-testid=google-pay-setting-error]")
}

test.describe("paying with Google Pay through Braintree", {
  tag: "@payment-sessions",
}, () => {
  test("renders Google's button beside the card fields", async ({
    checkout,
  }) => {
    test.setTimeout(120_000)

    await checkout.selectPaymentSetting("Braintree")
    await checkout.acceptTerms()

    await expect(googlePayButton(checkout.page)).toBeVisible({
      timeout: 30_000,
    })
    await expect(
      checkout.page.locator('iframe[name="braintree-hosted-field-number"]'),
    ).toBeVisible()
    // Both routes are live: the card through ours, Google Pay through its own.
    await expect(checkout.placeButton).toBeEnabled()
  })

  /**
   * Google's button has no disabled state, so a closed gate has to say why,
   * or the button would simply do nothing.
   */
  test("explains itself when clicked before the terms are accepted", async ({
    checkout,
  }) => {
    test.setTimeout(120_000)

    await checkout.selectPaymentSetting("Braintree")
    await expect(googlePayButton(checkout.page)).toBeVisible({
      timeout: 30_000,
    })
    // Deliberately not accepting them.

    await googlePayButton(checkout.page).click()

    await expect(googlePayError(checkout.page)).toContainText(/terms/i, {
      timeout: 30_000,
    })
  })

  /**
   * The assertion the design rests on: the sheet opens. An asynchronous gate,
   * or gift cards charged on the click, would spend the gesture before
   * `loadPaymentData()`, and Google would open nothing.
   */
  test("opens Google's sheet, so the click's gesture survived", async ({
    checkout,
  }) => {
    test.setTimeout(120_000)

    await checkout.selectPaymentSetting("Braintree")
    await checkout.acceptTerms()
    await expect(googlePayButton(checkout.page)).toBeVisible({
      timeout: 30_000,
    })

    // Google shows its sheet in an iframe on the page or in a window of its
    // own, depending on the browser; either is the sheet opening.
    let popupOpened = false
    checkout.page.once("popup", () => {
      popupOpened = true
    })
    await googlePayButton(checkout.page).click()

    const sheet = checkout.page
      .locator("iframe[src*='pay.google.com'], iframe[name*='googlepay']")
      .first()
    await expect
      .poll(async () => popupOpened || (await sheet.count()) > 0, {
        message:
          "Google Pay's sheet did not open — the click's user gesture was spent before loadPaymentData()",
        timeout: 30_000,
      })
      .toBe(true)

    // And nothing was reported: the gate was open and the click did no I/O.
    await expect(googlePayError(checkout.page)).toBeHidden()
  })
})
