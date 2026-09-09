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
/**
 * Adyen's test card for the 3D Secure 2 **challenge** flow.
 *
 * Chosen over a frictionless one on purpose: the challenge is what the shopper
 * can fail, and failing it is the branch these tests exist for.
 *
 * https://docs.adyen.com/development-resources/test-cards-and-credentials/test-card-numbers
 */
export const ADYEN_3DS_CARD = {
  number: "4166676667666746",
  exp: "0330",
  cvc: "737",
}

/** The word Adyen's test challenge page accepts. Anything else is refused. */
export const ADYEN_3DS_PASSWORD = "password"

/**
 * Stripe's test card that authorizes without a challenge.
 *
 * The frictionless one on purpose: what this suite is proving is the chain from
 * `confirmPayment` through `requires_capture` to a placed order. Stripe's 3DS
 * card is `4000002500003155`, for when that branch gets its own test.
 *
 * https://docs.stripe.com/testing
 */
export const STRIPE_CARD = {
  number: "4242424242424242",
  exp: "1234",
  cvc: "123",
  zip: "10001",
}

export interface PayPalCredentials {
  email: string
  password: string
}

/**
 * The PayPal **sandbox buyer** these tests log in as, or `null`.
 *
 * `NP_*` and deliberately **not** `E2E_PAYPAL_*`. A PayPal sandbox buyer is
 * only good against the PayPal business sandbox account that the Adyen merchant
 * account is linked to, and that link is per merchant account — so the buyer
 * that works for the `payment_source` suite, on the `E2E_*` organization, is
 * refused here. Sharing the variable produced exactly one confusing failure:
 * PayPal approves the payment, because the buyer is a perfectly valid PayPal
 * account, and Adyen then answers `Refused`.
 *
 * Returned as `null` rather than thrown so a test can skip with a reason — a
 * missing sandbox buyer is an environment that cannot run the test, not a
 * checkout that is broken, and failing the two the same way hides real
 * regressions behind a setup problem.
 */
export function payPalCredentials(): PayPalCredentials | null {
  const email = process.env.NP_PAYPAL_EMAIL
  const password = process.env.NP_PAYPAL_PASSWORD
  if (email == null || password == null) return null
  if (email.length === 0 || password.length === 0) return null
  return { email, password }
}

/**
 * Type into one of Stripe's fields, and put back what Link takes away.
 *
 * Stripe's Link expands an inline sign-up — email, mobile, full name — as soon
 * as a card number starts being typed, and **it takes the focus**. The rest of
 * the keystrokes then land in its email box, leaving one digit in the card
 * field and a form that reports itself incomplete. It is not deterministic: how
 * far the typing gets depends on how long Link's iframe has had to wake up, so
 * the same fill passes before a gift card has been applied and fails after.
 *
 * So each field is verified and, if the value came out short, refilled —
 * cleared first, since a truncated attempt is still in there. Bounded, because
 * a field that will not accept a value should fail as itself rather than spin.
 */
async function typeStripeField(input: Locator, value: string): Promise<void> {
  await expect(input).toBeVisible({ timeout: 30_000 })
  const digits = (text: string): string => text.replace(/[^0-9]/g, "")

  for (let attempt = 1; attempt <= 3; attempt++) {
    await input.click()
    if (attempt > 1) {
      // A previous attempt left something behind, and Stripe reformats as you
      // type — so the field is emptied rather than appended to.
      await input.press("ControlOrMeta+a")
      await input.press("Backspace")
    }
    await input.pressSequentially(value, { delay: 20 })
    if (digits(await input.inputValue()) === digits(value)) return
  }

  expect(
    digits(await input.inputValue()),
    `Stripe kept only part of "${value}"`,
  ).toBe(digits(value))
}

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
   * Every radio in the setting group. Their `name` carries the setting id, so
   * there is no stable value to match on.
   */
  get paymentSettingRadios(): Locator {
    return this.page.locator("input[name^=payment-setting-]")
  }

  /** Whichever radios are currently selected — at most one, per the model. */
  get checkedPaymentSettingRadios(): Locator {
    return this.page.locator("input[name^=payment-setting-]:checked")
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
    const card = this.paymentSetting(name)
    await card.click()
    try {
      // Scoped to the card that was clicked, not `radios.first()`. That worked
      // only while `manual` was the one implemented setting: with a second one
      // rendered, the first radio in the group belongs to whichever setting the
      // order happens to list first, and the assertion fails on a selection
      // that in fact succeeded.
      await expect(card.locator("input[name^=payment-setting-]")).toBeChecked()
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

  /**
   * True when no payment setting is selected — the state after a gift card
   * changes, or after a refused card burnt its Payment Session.
   *
   * Counts the checked radios rather than testing one of them: with more than
   * one setting rendered, "the first is unchecked" is satisfied while another
   * is selected.
   */
  async expectNoPaymentSettingSelected(): Promise<void> {
    await expect(this.checkedPaymentSettingRadios).toHaveCount(0)
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
    // Open the section only when it is really closed. "No input" is not that
    // signal on its own: with a card already applied the field steps aside for
    // the add link, and pressing the toggle then *closes* a section that was
    // open — taking the link with it, so the field never comes back. Applying a
    // second card in a row was enough to hit it.
    if (
      (await this.giftCardInput.count()) === 0 &&
      (await this.giftCardAddLink.count()) === 0
    ) {
      await this.giftCardToggle.click()
    }
    if ((await this.giftCardAddLink.count()) > 0) {
      await this.giftCardAddLink.click()
    }
    await expect(
      this.giftCardInput,
      "the gift card field never appeared — is another card already applied and the section closed?",
    ).toBeVisible()
    await this.giftCardInput.fill(code)
    await expect(this.giftCardApplyButton).toBeEnabled()
    await this.giftCardApplyButton.click()
  }

  /** Apply a code and wait for it to land as an applied card. */
  async applyGiftCardSuccessfully(code: string): Promise<void> {
    await this.applyGiftCard(code)
    await expect(this.giftCardRow(code)).toBeVisible()
  }

  /**
   * Take a gift card off the order.
   *
   * The wait is long because the same control does two different things: an
   * unauthorized card is one `DELETE`, but a charged one is refunded — created
   * `pending`, settled by a background job, and polled for — and the row only
   * goes once the session reads `refunded`.
   */
  async removeGiftCard(code: string): Promise<void> {
    await this.giftCardRow(code)
      .locator("[data-testid=gift-card-remove]")
      .click()
    await expect(this.giftCardRow(code)).toHaveCount(0, { timeout: 30_000 })
  }

  /**
   * The element the Adyen Drop-in mounts into.
   *
   * The class comes from this application — `ADYEN_CONTAINER_CLASS` in
   * `StepPayment/styled.tsx` — because the library renders the container but
   * takes its class as a prop. Every Adyen locator below is scoped to it, so a
   * page that also carries the `payment_source` model's Drop-in cannot be
   * matched by accident.
   */
  get adyenDropin(): Locator {
    return this.page.locator(".adyen-dropin-container")
  }

  /**
   * Stripe's Payment Element, which lives in an iframe Stripe owns.
   *
   * Addressed by the container this application names plus the iframe inside
   * it, rather than by iframe position: the page can carry Adyen's secured
   * fields at the same time.
   */
  get stripeElement(): Locator {
    return this.page.locator(".stripe-elements-container iframe").first()
  }

  /**
   * Fill Stripe's card fields.
   *
   * One iframe for all of them, unlike Adyen's field-per-iframe secured fields,
   * so this is a single frame locator addressed by accessible name. Typed
   * rather than `fill()`ed for the same reason as Adyen's: the Element listens
   * for the events real typing produces.
   */
  async fillStripeCard(card = STRIPE_CARD): Promise<void> {
    await expect(this.stripeElement).toBeVisible({ timeout: 30_000 })
    const frame = this.page
      .frameLocator(".stripe-elements-container iframe")
      .first()

    const fields: Array<[RegExp, string]> = [
      [/card number/i, card.number],
      [/expiration|expiry/i, card.exp],
      [/security code|cvc|cvv/i, card.cvc],
    ]
    for (const [name, value] of fields) {
      await typeStripeField(frame.getByRole("textbox", { name }), value)
    }

    // Some Dashboard configurations ask for a postal code as well; filling it
    // when it is there is cheaper than a test that fails on an incomplete form.
    const zip = frame.getByRole("textbox", { name: /zip|postal/i })
    if ((await zip.count()) > 0) {
      await zip.click()
      await zip.pressSequentially(card.zip, { delay: 20 })
    }

    // Fail here, on the form, rather than later on the thank-you page. An
    // incomplete Element makes `elements.submit()` show its own validation, and
    // the place button then reports nothing — correctly, since the shopper
    // simply has not finished — so a mistyped field is otherwise indis-
    // tinguishable from a payment that never arrived.
    await expect(
      this.page.locator("[data-testid=stripe-state]"),
      "Stripe's Payment Element does not consider the card complete",
    ).toHaveText("ready", { timeout: 15_000 })
  }

  /** A Drop-in that could not load says so here; a refusal is an order error. */
  get adyenError(): Locator {
    return this.page.locator("[data-testid=adyen-setting-error]")
  }

  /**
   * One of Adyen's PCI secured fields, which each live in their own iframe.
   *
   * Addressed by field class and accessible label rather than by iframe
   * position. `iframe >> nth=0` is what the `payment_source` fixture does, and
   * it breaks the moment anything else on the page frames something.
   */
  private adyenField(
    field: "cardNumber" | "expiryDate" | "securityCode",
    label: string,
  ): Locator {
    return this.page
      .frameLocator(
        `.adyen-dropin-container .adyen-checkout__field--${field} iframe`,
      )
      .getByRole("textbox", { name: label })
  }

  /**
   * Fill the card form.
   *
   * Typed rather than `fill()`ed: Adyen's fields listen for the events real
   * typing produces, and a single `fill()` can leave the Drop-in believing the
   * form is still invalid — at which point the place button submits nothing and
   * the failure looks like a timeout on the thank-you page.
   */
  async fillAdyenCard(card = ADYEN_3DS_CARD): Promise<void> {
    await expect(this.adyenDropin).toBeVisible({ timeout: 30_000 })
    const fields: Array<
      [Parameters<typeof this.adyenField>[0], string, string]
    > = [
      ["cardNumber", "Card number", card.number],
      ["expiryDate", "Expiry date", card.exp],
      ["securityCode", "Security code", card.cvc],
    ]
    for (const [field, label, value] of fields) {
      const input = this.adyenField(field, label)
      await expect(input).toBeVisible({ timeout: 30_000 })
      await input.click()
      await input.pressSequentially(value, { delay: 20 })
    }

    // Fail here, on the form, rather than later on whatever was supposed to
    // follow the payment. An invalid field leaves the Drop-in reporting itself
    // invalid, the place button then submits nothing and — correctly — says
    // nothing, so the test goes on to wait out a full timeout on a 3DS iframe
    // that was never coming. A mistyped card number cost exactly that, and read
    // as a 3DS problem.
    //
    // The icon's name is read in English because this suite runs the default
    // locale; the localised checkout has its own test.
    await expect(
      this.adyenDropin.getByRole("img", { name: "Error" }),
      "Adyen rejected one of the card fields",
    ).toHaveCount(0)
  }

  /**
   * PayPal's row in the Drop-in's method list.
   *
   * A radio, like every other method: the Drop-in offers cards and PayPal at
   * once, and which one is open is what decides who collects.
   */
  get adyenPayPalOption(): Locator {
    return this.adyenDropin.getByRole("radio", { name: /PayPal/i })
  }

  /**
   * PayPal's own pay button, inside the expanded row.
   *
   * The button itself lives in a cross-origin iframe PayPal renders, so this
   * addresses the wrapper Adyen mounts it into. Clicking that dispatches a real
   * mouse event at its centre, which the browser routes into the iframe — the
   * only way to reach a button no locator can see.
   */
  get adyenPayPalButton(): Locator {
    return this.adyenDropin.locator(".adyen-checkout__paypal__button").first()
  }

  /**
   * The application's reason for a disabled place button.
   *
   * Rendered from `collection.by === "gateway"` on the handoff: the library
   * ships no copy, so this test id is this repository's.
   */
  get gatewayOwnsButtonHint(): Locator {
    return this.page.locator("[data-testid=gateway-owns-button]")
  }

  /**
   * The card row in the same list.
   *
   * Only rendered when the Drop-in has more than one method to offer — with one
   * it shows the form and no radios at all — so it exists precisely on the
   * orders where switching back from PayPal is possible.
   */
  get adyenCardOption(): Locator {
    return this.adyenDropin.getByRole("radio", { name: /card/i })
  }

  /** Open PayPal's row and wait for its button to render. */
  async selectAdyenPayPal(): Promise<void> {
    await expect(this.adyenDropin).toBeVisible({ timeout: 30_000 })
    // Named, because the generic timeout that follows reads as a broken
    // checkout when it usually means PayPal is not switched on for the Adyen
    // account this organization points at.
    await expect(
      this.adyenPayPalOption,
      "the Drop-in offered no PayPal row — check that PayPal is enabled on the Adyen account",
    ).toBeVisible({ timeout: 30_000 })
    await this.adyenPayPalOption.click({ force: true })
    await expect(this.adyenPayPalButton).toBeVisible({ timeout: 60_000 })
  }

  /** Google Pay's row in the Drop-in's method list. */
  get adyenGooglePayOption(): Locator {
    return this.adyenDropin.getByRole("radio", { name: /google pay/i })
  }

  /**
   * Google Pay's own button.
   *
   * A real DOM button, not an iframe: Google's `paymentsClient.createButton()`
   * returns an element that Adyen appends into this container. So unlike
   * PayPal's, this one can be addressed and clicked directly.
   */
  get adyenGooglePayButton(): Locator {
    return this.adyenDropin
      .locator("[data-testid=googlepay-button-container] button")
      .first()
  }

  /** Open Google Pay's row and wait for its button to render. */
  async selectAdyenGooglePay(): Promise<void> {
    await expect(this.adyenDropin).toBeVisible({ timeout: 30_000 })
    // Named, because the timeout that follows otherwise reads as a broken
    // checkout: `isReadyToPay()` decides this, and a browser Google Pay does
    // not support drops the row before anything of ours runs.
    await expect(
      this.adyenGooglePayOption,
      "the Drop-in offered no Google Pay row — check isReadyToPay() in this browser and that Google Pay is enabled on the Adyen account",
    ).toBeVisible({ timeout: 30_000 })
    await this.adyenGooglePayOption.click({ force: true })
    await expect(this.adyenGooglePayButton).toBeVisible({ timeout: 60_000 })
  }

  /** Go back to the card row, which puts collection back on our own button. */
  async selectAdyenCard(): Promise<void> {
    await expect(this.adyenCardOption).toBeVisible({ timeout: 30_000 })
    await this.adyenCardOption.click({ force: true })
  }

  /**
   * Pay through PayPal's own button, from the click to the approval.
   *
   * The popup listener is registered *before* the click that opens it: awaiting
   * the click first lets the event fire with nothing listening, and the wait
   * then times out on a window that is already open.
   *
   * Everything after the click is PayPal's own sandbox UI, which changes without
   * warning and is the most likely thing here to break for reasons that are not
   * this checkout's.
   */
  async payWithPayPal(credentials: PayPalCredentials): Promise<void> {
    const popupPromise = this.page.waitForEvent("popup", { timeout: 60_000 })
    await this.adyenPayPalButton.click({ force: true })
    const popup = await popupPromise
    await popup.waitForLoadState()

    await popup.fill("input[name=login_email]", credentials.email)
    // Two-step sign-in: the email is submitted on its own, and the password
    // field does not exist until it has been.
    await popup.click("#btnNext")
    await popup.fill("input[name=login_password]", credentials.password)
    await popup.click("#btnLogin")

    const banner = popup.locator("#gdpr-container >> text=Accept")
    if (await banner.isVisible().catch(() => false)) {
      await banner.click()
    }

    await popup.click('[data-testid="submit-button-initial"]', {
      timeout: 60_000,
    })
  }

  /**
   * Answer Adyen's 3DS challenge.
   *
   * `adyen-web` renders it in place — this is the sessions flow, where the
   * library owns the whole authentication round trip — so there is no
   * navigation to wait for, just an iframe that appears after the submit.
   */
  async submitThreeDSChallenge(password: string): Promise<void> {
    const iframe = this.page.locator("iframe[name=threeDSIframe]")
    await expect(iframe).toBeVisible({ timeout: 60_000 })
    const challenge = this.page.frameLocator("iframe[name=threeDSIframe]")
    const input = challenge.getByPlaceholder("enter the word 'password'")
    await expect(input).toBeVisible({ timeout: 30_000 })
    await input.fill(password)
    await challenge.locator("#buttonSubmit").click()
  }

  /**
   * Click place without waiting for the outcome.
   *
   * The card paths need this: the click submits the Drop-in, and what happens
   * next is a challenge to answer rather than a page to wait for.
   */
  async startPlaceOrder(): Promise<void> {
    await expect(this.placeButton).toBeEnabled()
    await this.placeButton.click()
  }

  /**
   * Wait for the thank-you page.
   *
   * Generous because the wait is a webhook round trip through Adyen, not a
   * local job: the library polls placeability until the authorization settles.
   */
  async expectPlaced(): Promise<void> {
    await expect(this.paymentRecap).toBeVisible({ timeout: 90_000 })
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
