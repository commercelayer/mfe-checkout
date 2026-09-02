import { expect, type Locator, type Page } from "@playwright/test"

/**
 * Page object for the payment step of an order on the `payment_sessions` model.
 *
 * Deliberately not part of `CheckoutPage`. That one is built around the
 * `payment_source` model — `selectPayment("stripe")`, `setPayment()`,
 * `save("Payment")` — and this model has none of those moves: the settings are
 * a radio group, gift cards are additive rather than one of the alternatives,
 * and there is a single place button instead of a per-step save. The two
 * library trees are separate on purpose (see CLAUDE.md); keeping the page
 * objects separate keeps that boundary visible.
 *
 * Every selector here is a `data-testid` this application sets itself, in
 * `components/composite/StepPayment/CheckoutPaymentSessions.tsx` and
 * `StepPlaceOrder/index.tsx` — the library ships none. So the contract these
 * tests lean on lives in the same repository as the tests, and a rename breaks
 * both at once rather than silently.
 */
export class PaymentSessionsCheckoutPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  /**
   * The gift card box, not a payment setting, is the "payment step is ready"
   * signal: it renders for every order on this model, including one gift cards
   * have already covered — which is exactly when the method selector is gone.
   * Waiting on a setting instead would hang on that order, and waiting on the
   * step's subtitle would tie the fixture to the `en` locale.
   */
  async waitForPaymentStep(): Promise<void> {
    await expect(this.giftCardBox).toBeVisible({ timeout: 60_000 })
  }

  get giftCardBox(): Locator {
    return this.page.locator("[data-testid=gift-card-sessions]")
  }

  get giftCardToggle(): Locator {
    return this.page.locator("[data-testid=gift-card-toggle]")
  }

  get giftCardInput(): Locator {
    return this.page.locator("[data-testid=gift-card-input]")
  }

  get giftCardApplyButton(): Locator {
    return this.page.locator("[data-testid=gift-card-apply]")
  }

  /** The "add another one" link, shown once a card is applied. */
  get giftCardAddLink(): Locator {
    return this.page.locator("[data-testid=gift-card-add]")
  }

  get giftCardError(): Locator {
    return this.page.locator("[data-testid=gift-card-error]")
  }

  get giftCardRows(): Locator {
    return this.page.locator("[data-testid=gift-card-session]")
  }

  giftCardRow(code: string): Locator {
    return this.giftCardRows.filter({ hasText: code })
  }

  get paymentSettings(): Locator {
    return this.page.locator("[data-testid=payment-setting-item]")
  }

  paymentSetting(name: string): Locator {
    return this.paymentSettings.filter({ hasText: name })
  }

  /**
   * The radio inside a setting card. Its `name` carries the setting id, so
   * there is no stable value to match on — but there is at most one selected
   * setting per order, so the group as a whole answers "is anything picked".
   */
  get paymentSettingRadios(): Locator {
    return this.page.locator("input[name^=payment-setting-]")
  }

  get termsCheckbox(): Locator {
    return this.page.locator("[data-testid=checkbox-privacy-and-terms]")
  }

  get placeButton(): Locator {
    return this.page.locator("[data-testid=save-payment-button]")
  }

  get orderErrors(): Locator {
    return this.page.locator("[data-testid=errors-container]")
  }

  get totalAmount(): Locator {
    return this.page.locator("[data-testid=total-amount]")
  }

  get giftCardAmount(): Locator {
    return this.page.locator("[data-testid=giftcard-amount]")
  }

  get paymentRecap(): Locator {
    return this.page.locator("[data-testid=payment-recap]")
  }

  /**
   * Pick a payment setting and wait until the order has actually stored it.
   *
   * The card is a `<label>`, so one click reaches the radio exactly once
   * wherever it lands. The wait is on the radio rather than on a timeout: the
   * session is created server-side and the library refetches, so the checked
   * state is the first thing that proves the round trip finished.
   */
  async selectPaymentSetting(name: string): Promise<void> {
    await this.paymentSetting(name).click()
    try {
      await expect(this.paymentSettingRadios.first()).toBeChecked()
    } catch (error) {
      // Selecting writes a session to the order, so a refused selection means
      // the radio stays unchecked and "unexpected value unchecked" is all the
      // failure says. The application renders the reason in its own outlet,
      // because a selection error lives on the setting's context rather than
      // on the order — so read it out and put it in the message.
      const reason = await this.page
        .locator("[data-testid=payment-setting-error]")
        .allInnerTexts()
        .catch(() => [])
      const said = reason.join(" ").trim()
      if (said.length > 0) {
        throw new Error(`Selecting "${name}" was refused: ${said}`)
      }
      throw error
    }
  }

  /** True when no payment setting is selected — the state after a gift card changes. */
  async expectNoPaymentSettingSelected(): Promise<void> {
    await expect(this.paymentSettingRadios.first()).not.toBeChecked()
  }

  /**
   * Apply a gift card code, whatever state the box is in.
   *
   * Three cases have to be handled and each is reachable from a real flow: the
   * box is collapsed (nothing applied yet), the box is open with the field
   * showing, or a card is already applied and the field has stepped aside for
   * the "add another one" link.
   */
  async applyGiftCard(code: string): Promise<void> {
    if ((await this.giftCardInput.count()) === 0) {
      await this.giftCardToggle.click()
    }
    if ((await this.giftCardAddLink.count()) > 0) {
      await this.giftCardAddLink.click()
    }
    await this.giftCardInput.fill(code)
    await expect(this.giftCardApplyButton).toBeEnabled()
    await this.giftCardApplyButton.click()
  }

  /** Apply a code and wait for it to land as an applied card. */
  async applyGiftCardSuccessfully(code: string): Promise<void> {
    await this.applyGiftCard(code)
    await expect(this.giftCardRow(code)).toBeVisible()
  }

  async removeGiftCard(code: string): Promise<void> {
    await this.giftCardRow(code)
      .locator("[data-testid=gift-card-remove]")
      .click()
    await expect(this.giftCardRow(code)).toHaveCount(0)
  }

  /**
   * Tick the privacy and terms box.
   *
   * It only renders when the organization or the order carries both URLs, and
   * the library treats a missing pair as accepted — so a no-op here is correct
   * rather than a silent skip. Tests assert on the place button, which tells
   * the truth either way.
   */
  async acceptTerms(): Promise<void> {
    if ((await this.termsCheckbox.count()) === 0) return
    await this.termsCheckbox.check()
  }

  /**
   * Place the order and wait for the thank-you page.
   *
   * The generous timeout is the point of the wait: placing authorizes every
   * session, and authorizing runs in a background job that the library polls
   * for. A run that waits only for the default assertion timeout fails on a
   * payment that was about to succeed — the exact mistake the library's own
   * retry loop exists to avoid.
   */
  async placeOrder(): Promise<void> {
    await expect(this.placeButton).toBeEnabled()
    await this.placeButton.click()
    await expect(this.paymentRecap).toBeVisible({ timeout: 60_000 })
  }
}
