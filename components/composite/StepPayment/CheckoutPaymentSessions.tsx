import type {
  PaymentSettingGiftCardChildrenProps,
  PaymentSettingOnSelectParams,
} from "@commercelayer/react-components"
import {
  PaymentSetting,
  PaymentSettingAdyenPayment,
  PaymentSettingBraintreeApplePay,
  PaymentSettingBraintreePayment,
  PaymentSettingBraintreePayPal,
  PaymentSettingGiftCard,
  PaymentSettingGiftCardList,
  PaymentSettingGiftCardListItem,
  PaymentSettingName,
  PaymentSettingPayPalPayment,
  PaymentSettingStripePayment,
  useOrderContainer,
} from "@commercelayer/react-components"
import type { Order } from "@commercelayer/sdk"
import { Label } from "components/ui/Label"
import { type JSX, useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import {
  ADYEN_CONTAINER_CLASS,
  AdyenError,
  APPLE_PAY_BUTTON_CLASS,
  BRAINTREE_CLASS_NAMES,
  BRAINTREE_CONTAINER_CLASS,
  BRAINTREE_WALLETS_CLASS,
  BRAINTREE_WALLETS_DIVIDER_CLASS,
  GiftCardAddLink,
  GiftCardBody,
  GiftCardHeader,
  GiftCardIcon,
  GiftCardInputRow,
  GiftCardRow,
  GiftCardSwitch,
  GiftCardTitle,
  GiftCardWrapper,
  PaymentSettingBox,
  PaymentSettingCard,
  PaymentSettingError,
  PaymentSettingItem,
  STRIPE_CONTAINER_CLASS,
  StyledGiftCardSessionError,
  StyledGiftCardSessionInput,
  StyledGiftCardSessionRemove,
  StyledGiftCardSessionSubmit,
  StyledPaymentSettingRadioButton,
  WalletCheckbox,
} from "./styled"

interface Props {
  /**
   * Called once the selection has been stored on the order, so the app can
   * refetch and recompute whether the payment step is complete.
   *
   * Applying or removing a gift card calls it too: both also delete the session
   * paying the difference, so the answer to "is payment in place" changes
   * without anyone touching the method selector.
   *
   * It receives the order as the library has just refetched it. The app's own
   * copy is not up to date yet at this point: the library hands its order over
   * from an effect of its provider, and a parent's effects run after its
   * children's. Recomputing from that copy would answer from the order as it
   * was before the change.
   */
  onSelect: (order?: Order) => void
  /**
   * The store's name. Apple Pay's sheet shows it — "Pay {companyName}" — and
   * merchant validation sends it to Apple, so it is the organization's own
   * name, never a translated string.
   */
  companyName: string
}

/**
 * Payment step for orders on the `payment_sessions` model.
 *
 * Mounted alongside `<CheckoutPayment>`, never instead of it: both library
 * trees read the order and step aside when it is not on their model, so no
 * conditional is needed here. API version 2026-05 is additive, so an order can
 * carry both sets of options and the newer one wins inside the library.
 *
 * It stays mounted even on the older model, on purpose: `<PaymentSetting>`
 * registers the payment-session includes, and that has to happen before the
 * order is fetched. Adding an include afterwards does not trigger a refetch, so
 * a component mounted only once the model is known would never get its data.
 *
 * Everything visible therefore lives *inside* `<PaymentSetting>` and
 * `<PaymentSettingGiftCard>`, which render nothing on the older model. Markup
 * placed outside would show an empty box on every order that is not on this
 * model.
 *
 * `payment_setting_manuals`, `payment_setting_adyens`,
 * `payment_setting_stripes` and `payment_setting_braintrees` are implemented —
 * other settings are skipped by `<PaymentSetting>` rather than rendered inert,
 * and so is a setting that is disabled or whose gateway carries no `public_key`.
 */
/**
 * Where a gateway sends the shopper back after a redirect.
 *
 * The access token comes off, exactly as `PaymentContainer` does it for
 * Checkout.com and for the same reason: a gateway that validates the URL
 * rejects one carrying the ~1.5 kB JWT. Adyen refuses a `returnUrl` over 1024
 * characters from gateway version 72 — which is the version a newly created
 * payment setting defaults to — with `Field 'returnUrl' may not exceed 1024
 * characters`.
 *
 * Nothing else has to be built for the return: `useLocalStorageToken` has
 * already saved the token under `checkoutAccessToken`, and
 * `useSettingsOrInvalid` re-authenticates a return that arrives without one
 * whenever it recognises a gateway marker — Adyen's `redirectResult` among them.
 * `paymentReturn=true` is set anyway, as the Checkout.com URL does, so the
 * return is recognisable even if the marker does not arrive.
 */
function paymentReturnUrl(): string | undefined {
  if (typeof window === "undefined") return undefined
  const url = new URL(window.location.href)
  url.searchParams.delete("accessToken")
  url.searchParams.set("paymentReturn", "true")
  // Adyen's own return parameters, which are single-use: a second attempt must
  // not be created with the first one's spent `redirectResult`.
  for (const spent of ["redirectResult", "sessionId", "resultCode"]) {
    url.searchParams.delete(spent)
  }
  url.hash = ""
  return url.toString()
}

export const CheckoutPaymentSessions = ({
  onSelect,
  companyName,
}: Props): JSX.Element => {
  const { t } = useTranslation()

  /**
   * The library's own wording, or ours where we have some.
   *
   * `meta.error` is the machine-readable half — a gateway's `resultCode`, or a
   * reason the library named — and `message` is the English default a package
   * that cannot know our locale has to ship. So the codes we recognise get
   * translated and everything else falls through, which keeps an unrecognised
   * refusal legible instead of blank.
   */
  const adyenErrorMessage = (error: {
    message?: string
    meta?: Record<string, unknown>
  }): string => {
    if (error.meta?.error === "TermsNotAccepted") {
      return t("stepPayment.acceptTermsToPay")
    }
    return error.message ?? ""
  }

  /**
   * Braintree's codes in our words. The library's `message` is English, and
   * the codes are Braintree's own (`HOSTED_FIELDS_…`, `THREEDS_…`), the 3DS
   * status when the shopper did not authenticate, or the authorization status
   * when Braintree refused the payment.
   */
  const braintreeErrorMessage = (error: {
    message?: string
    meta?: Record<string, unknown>
  }): string => {
    const code = typeof error.meta?.error === "string" ? error.meta.error : ""
    if (code === "TermsNotAccepted") {
      return t("stepPayment.acceptTermsToPay")
    }
    if (code.startsWith("HOSTED_FIELDS_FIELDS_")) {
      return t("stepPayment.completeCardDetails")
    }
    if (
      code.startsWith("THREEDS_") ||
      code.startsWith("authenticate_") ||
      code.startsWith("challenge_") ||
      code === "liability_not_shifted"
    ) {
      return t("stepPayment.cardNotAuthenticated")
    }
    if (code === "declined" || code === "failed") {
      return t("stepPayment.paymentDeclined")
    }
    return error.message ?? ""
  }

  const onSettingSelect = useCallback(
    ({ order }: PaymentSettingOnSelectParams) => {
      onSelect(order)
    },
    [onSelect],
  )

  return (
    <>
      <PaymentSetting onSelect={onSettingSelect} returnUrl={paymentReturnUrl()}>
        {({
          setting,
          isSelected,
          isPending,
          errors,
          canSaveCard,
          saveCard,
          setSaveCard,
        }) => (
          <PaymentSettingBox
            isSelected={isSelected}
            data-testid="payment-setting-box"
          >
            {/* A <label> rather than a click handler: one click reaches the radio
              exactly once whatever it lands on, so the whole card is the target
              without any risk of selecting twice. The border is on the box
              around it, so the gateway's form below still sits inside it. */}
            <PaymentSettingCard
              htmlFor={setting.id}
              isSelected={isSelected}
              data-testid="payment-setting-item"
            >
              <PaymentSettingItem>
                <StyledPaymentSettingRadioButton />
                <PaymentSettingName />
              </PaymentSettingItem>
              {/* A selection that failed never became a Payment Session, so no
                gateway component below mounts to say so: this is the only
                place the shopper hears about it, whatever the setting. The
                API's wording ("invalid query" for a 500) means nothing to
                them, so the copy is ours, and the raw reason rides along in an
                attribute for whoever has to debug it. Selection errors live on
                the setting's context, not on the order, so
                <Errors resource="..."> would never see them. */}
              {errors.length > 0 && (
                <PaymentSettingError
                  data-testid="payment-setting-error"
                  data-error-detail={errors
                    .map((error) => error.message)
                    .join(" ")}
                >
                  {t("stepPayment.paymentMethodNotLoaded")}
                </PaymentSettingError>
              )}
            </PaymentSettingCard>

            {/* Deliberately outside the label: the label is a <label>, and a click
              on one of Adyen's inputs inside it would be forwarded to the radio
              the label points at, taking focus off the field being typed into.
              The component renders its own mount target and calls the function
              child after it — the Drop-in has to have somewhere to attach. */}
            {/* Apple Pay is asked for, not defaulted: its button renders on
              any Safari with a card in Wallet, and merchant validation then
              fails unless this exact domain is registered for Apple Pay on the
              Adyen merchant account — via the Management API
              `addApplePayDomains`, plus the `.well-known` association file
              served publicly. Adding it here is a statement that the domains
              this checkout is served from have been registered. Remove it if
              that stops being true; a shopper otherwise meets a button that
              cannot work. */}
            <PaymentSettingAdyenPayment
              paymentMethods={[
                "card",
                "paypal",
                "google_pay",
                "apple_pay",
                "klarna",
              ]}
              containerClassName={ADYEN_CONTAINER_CLASS}
            >
              {({ errors: adyenErrors }) => {
                if (adyenErrors.length === 0) return <></>
                return (
                  <AdyenError data-testid="adyen-setting-error">
                    {adyenErrors.map(adyenErrorMessage).join(" ")}
                  </AdyenError>
                )
              }}
            </PaymentSettingAdyenPayment>

            {/* The consent to keep the card, for a signed-in customer on Stripe
              or Braintree — Adyen's Drop-in asks on its own, so the library
              never offers it there. Above the form on purpose: the choice is
              fixed when the Payment Session is created, so changing it replaces
              the session and the form remounts empty. Asked before typing, it
              costs nothing.

              Worded as a card only on Stripe. On Braintree the choice goes
              with the session, not with the card fields, so an Apple Pay
              payment on the same setting is stored too. */}
            {isSelected && canSaveCard && (
              <div className="flex items-center px-4 mt-3 mb-4">
                <WalletCheckbox
                  name={`save-card-${setting.id}`}
                  id={`save-card-${setting.id}`}
                  data-testid="payment-setting-save-card"
                  className="form-checkbox"
                  checked={saveCard}
                  disabled={isPending}
                  onChange={(event) => {
                    void setSaveCard(event.target.checked)
                  }}
                />
                <Label
                  htmlFor={`save-card-${setting.id}`}
                  textLabel={t(
                    setting.type === "payment_setting_stripes"
                      ? "stepPayment.saveToWallet"
                      : "stepPayment.savePaymentMethodToWallet",
                  )}
                />
              </div>
            )}

            {/* Outside the label for the same reason as Adyen's: the header is a
              <label>, and a click on one of Stripe's inputs inside it would be
              forwarded to the radio the label points at. */}
            <PaymentSettingStripePayment
              containerClassName={STRIPE_CONTAINER_CLASS}
            >
              {({ errors: stripeErrors, isReady }) => (
                <>
                  {/* Whether the Element considers itself complete. Rendered
                    because the place-order button does not gate on it — an
                    incomplete form makes `elements.submit()` show its own
                    validation and the button then reports nothing, by design.
                    Without this, an end-to-end test that mistypes a field waits
                    out a timeout on the thank-you page instead of saying what
                    was wrong. */}
                  <span hidden data-testid="stripe-state">
                    {isReady ? "ready" : "incomplete"}
                  </span>
                  {stripeErrors.length > 0 && (
                    <AdyenError data-testid="stripe-setting-error">
                      {stripeErrors.map((error) => error.message).join(" ")}
                    </AdyenError>
                  )}
                </>
              )}
            </PaymentSettingStripePayment>

            {/* Braintree's wallets, above its card fields. All of them stay
              live at once — the place button pays by card, each wallet through
              its own button — and each renders nothing where it cannot be
              offered, so on a browser without Apple Pay and a merchant without
              PayPal the block is empty and `empty:hidden` takes it away.

              Mounting Apple Pay is a statement that the domains this checkout
              is served from are registered for Apple Pay on the Braintree
              merchant: its button renders on any Safari that can pay, and
              merchant validation then fails on a domain that is not. Remove it
              if that stops being true. */}
            <div className={BRAINTREE_WALLETS_CLASS}>
              <PaymentSettingBraintreeApplePay
                displayName={companyName}
                className={APPLE_PAY_BUTTON_CLASS}
              >
                {({ errors: applePayErrors }) =>
                  applePayErrors.length > 0 ? (
                    <AdyenError
                      data-testid="apple-pay-setting-error"
                      className="px-0 pb-0"
                    >
                      {applePayErrors.map(braintreeErrorMessage).join(" ")}
                    </AdyenError>
                  ) : (
                    <></>
                  )
                }
              </PaymentSettingBraintreeApplePay>
              <PaymentSettingBraintreePayPal className="braintree-paypal-button">
                {({ errors: payPalErrors }) =>
                  payPalErrors.length > 0 ? (
                    <AdyenError
                      data-testid="braintree-paypal-setting-error"
                      className="px-0 pb-0"
                    >
                      {payPalErrors.map(braintreeErrorMessage).join(" ")}
                    </AdyenError>
                  ) : (
                    <></>
                  )
                }
              </PaymentSettingBraintreePayPal>
            </div>
            {/* One divider for however many wallets there are, shown only when
              the block above has something in it. */}
            <div className={BRAINTREE_WALLETS_DIVIDER_CLASS}>
              <span className="h-px grow bg-gray-200" />
              {t("stepPayment.orPayByCard")}
              <span className="h-px grow bg-gray-200" />
            </div>

            {/* Outside the label for the same reason again. Braintree's
              fields are its iframes, but the containers are ours, and a
              <label> around them would forward every click to the radio. */}
            <PaymentSettingBraintreePayment
              containerClassName={BRAINTREE_CONTAINER_CLASS}
              classNames={BRAINTREE_CLASS_NAMES}
              fields={{
                number: { label: t("stepPayment.cardNumber") },
                expirationDate: { label: t("stepPayment.cardExpiration") },
                cvv: { label: t("stepPayment.cardCvv") },
              }}
              styles={{
                input: { "font-size": "16px", "font-family": "monospace" },
              }}
            >
              {({ errors: braintreeErrors, isReady }) => (
                <>
                  {/* Rendered for the reason Stripe's is: the place button
                    does not gate on it, so without a marker an end-to-end
                    test that mistypes a field waits out a timeout instead of
                    saying what was wrong. */}
                  <span hidden data-testid="braintree-state">
                    {isReady ? "ready" : "incomplete"}
                  </span>
                  {braintreeErrors.length > 0 && (
                    <AdyenError data-testid="braintree-setting-error">
                      {braintreeErrors.map(braintreeErrorMessage).join(" ")}
                    </AdyenError>
                  )}
                </>
              )}
            </PaymentSettingBraintreePayment>

            {/* PayPal as a setting of its own. Its button is the only way to
              pay it, so the place button stands aside and says so, and the
              order is placed on its own once PayPal has approved. Outside the
              label: a click on PayPal's button must not reach the radio. */}
            <PaymentSettingPayPalPayment className="paypal-setting-button px-4 pb-4">
              {({ errors: payPalErrors, isUnavailable }) => (
                <>
                  {isUnavailable && (
                    <AdyenError data-testid="paypal-setting-unavailable">
                      {t("stepPayment.paypalUnavailable")}
                    </AdyenError>
                  )}
                  {payPalErrors.length > 0 && (
                    <AdyenError data-testid="paypal-setting-error">
                      {payPalErrors.map(braintreeErrorMessage).join(" ")}
                    </AdyenError>
                  )}
                </>
              )}
            </PaymentSettingPayPalPayment>
          </PaymentSettingBox>
        )}
      </PaymentSetting>

      {/* Gift cards sit outside <PaymentSetting>: they are additive, not one of
          the alternatives the radio group picks between, and several can be
          active at once. They also stay visible once they cover the order,
          which is when the method selector disappears — otherwise a shopper
          could not take one back off. */}
      <PaymentSettingGiftCard>
        {(giftCardState) => (
          <GiftCardSection {...giftCardState} onChange={onSelect} />
        )}
      </PaymentSettingGiftCard>
    </>
  )
}

/**
 * The "use a gift card" box.
 *
 * Open/closed is entirely this application's: the library holds no disclosure
 * state, it only says whether another card may be applied at all
 * (`canAddGiftCard` is false once the order is covered or something has been
 * authorized, where applying would fail with a 422).
 *
 * The switch governs the **controls**, never the applied cards. Those stay on
 * screen with their own Remove whatever it says: they are payments in place, and
 * a shopper who collapses the section to tidy the page must not silently lose
 * $25 of credit, nor be left unable to explain why less is owed. That also keeps
 * the switch always clickable — no disabled state to explain, and no removal
 * that could half-succeed and leave the control describing nothing.
 */
const GiftCardSection = ({
  giftCardSessions,
  canAddGiftCard,
  onChange,
}: PaymentSettingGiftCardChildrenProps & {
  onChange: (order?: Order) => void
}): JSX.Element => {
  const { t } = useTranslation()
  const { order } = useOrderContainer()
  const appliedCount = giftCardSessions.length
  const [isOpen, setIsOpen] = useState(false)
  const [isInputVisible, setIsInputVisible] = useState(true)
  const [seenCount, setSeenCount] = useState(appliedCount)

  // A card was applied or removed. On apply the field steps aside for the "add
  // another one" link, so a shopper who is done is not left looking at an empty
  // field; on removal it comes back.
  if (appliedCount !== seenCount) {
    setSeenCount(appliedCount)
    setIsInputVisible(appliedCount === 0)
  }

  // Both operations also delete the session paying the difference, so the app's
  // copy of the order is now wrong about whether payment is in place — the
  // accordion and the recap read that flag. The library has already refetched
  // its own copy, and that copy is the one passed on: `appliedCount` was
  // derived from it, while the app's own is still the order from before.
  //
  // Skipping the first run matters: on mount nothing changed, and calling in
  // would refetch the order on every render of the payment step.
  const notifiedCount = useRef(appliedCount)
  useEffect(() => {
    if (notifiedCount.current === appliedCount) return
    notifiedCount.current = appliedCount
    onChange(order ?? undefined)
  }, [appliedCount, onChange, order])

  return (
    <GiftCardWrapper data-testid="gift-card-sessions">
      <GiftCardHeader>
        <GiftCardTitle>{t("stepPayment.useGiftCard")}</GiftCardTitle>
        <GiftCardSwitch
          checked={isOpen}
          label={t("stepPayment.useGiftCard")}
          onChange={() => {
            setIsOpen(!isOpen)
          }}
          data-testid="gift-card-toggle"
        />
      </GiftCardHeader>

      {(isOpen || appliedCount > 0) && (
        <GiftCardBody>
          {/* Outside the switch's reach on purpose — see the note above. */}
          <PaymentSettingGiftCardList>
            <PaymentSettingGiftCardListItem>
              {({ code, formattedAmount }) => (
                <GiftCardRow data-testid="gift-card-session">
                  <GiftCardIcon />
                  <span className="min-w-0 font-mono break-all">{code}</span>
                  <StyledGiftCardSessionRemove
                    data-testid="gift-card-remove"
                    label={t("general.remove")}
                  />
                  <span className="ml-auto font-bold">{formattedAmount}</span>
                </GiftCardRow>
              )}
            </PaymentSettingGiftCardListItem>
          </PaymentSettingGiftCardList>

          {isOpen && isInputVisible && (
            <GiftCardInputRow>
              <StyledGiftCardSessionInput
                data-testid="gift-card-input"
                placeholder={t("stepPayment.giftCardCodePlaceholder")}
              />
              {/* The library defaults these two to English, which is right for
                  a package that cannot know the host's i18n — but it means the
                  label has to be passed, or the button stays "Apply" in every
                  locale. */}
              <StyledGiftCardSessionSubmit
                data-testid="gift-card-apply"
                label={t("general.apply")}
              />
            </GiftCardInputRow>
          )}

          {/* An unknown, expired or empty code is refused before anything is
              written to the order, so this is the only place the shopper can
              be told why nothing happened. */}
          {isOpen && (
            <StyledGiftCardSessionError data-testid="gift-card-error" />
          )}

          {isOpen && canAddGiftCard && !isInputVisible && (
            <GiftCardAddLink
              data-testid="gift-card-add"
              onClick={() => {
                setIsInputVisible(true)
              }}
            >
              {t("stepPayment.addAnotherGiftCard")}
            </GiftCardAddLink>
          )}
        </GiftCardBody>
      )}
    </GiftCardWrapper>
  )
}
