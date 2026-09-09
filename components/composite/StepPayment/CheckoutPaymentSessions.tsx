import type { PaymentSettingGiftCardChildrenProps } from "@commercelayer/react-components"
import {
  PaymentSetting,
  PaymentSettingAdyenPayment,
  PaymentSettingGiftCard,
  PaymentSettingGiftCardList,
  PaymentSettingGiftCardListItem,
  PaymentSettingManualPayment,
  PaymentSettingName,
} from "@commercelayer/react-components"
import { type JSX, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import {
  ADYEN_CONTAINER_CLASS,
  AdyenError,
  GiftCardAddLink,
  GiftCardBody,
  GiftCardHeader,
  GiftCardIcon,
  GiftCardInputRow,
  GiftCardRow,
  GiftCardSwitch,
  GiftCardTitle,
  GiftCardWrapper,
  PaymentSettingCard,
  PaymentSettingError,
  PaymentSettingItem,
  StyledGiftCardSessionError,
  StyledGiftCardSessionInput,
  StyledGiftCardSessionRemove,
  StyledGiftCardSessionSubmit,
  StyledPaymentSettingRadioButton,
} from "./styled"

interface Props {
  /**
   * Called once the selection has been stored on the order, so the app can
   * refetch and recompute whether the payment step is complete.
   *
   * Applying or removing a gift card calls it too: both also delete the session
   * paying the difference, so the answer to "is payment in place" changes
   * without anyone touching the method selector.
   */
  onSelect: () => void
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
 * `payment_setting_manuals` and `payment_setting_adyens` are implemented —
 * other settings are skipped by `<PaymentSetting>` rather than rendered inert,
 * and so is an Adyen setting that is disabled or carries no `public_key`.
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

export const CheckoutPaymentSessions = ({ onSelect }: Props): JSX.Element => {
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

  return (
    <>
      <PaymentSetting onSelect={onSelect} returnUrl={paymentReturnUrl()}>
        {({ setting, isSelected, errors }) => (
          <>
            {/* A <label> rather than a click handler: one click reaches the radio
              exactly once whatever it lands on, so the whole card is the target
              without any risk of selecting twice. */}
            <PaymentSettingCard
              htmlFor={setting.id}
              isSelected={isSelected}
              data-testid="payment-setting-item"
            >
              <PaymentSettingItem>
                <StyledPaymentSettingRadioButton />
                <PaymentSettingName />
              </PaymentSettingItem>
              <PaymentSettingManualPayment>
                {() => {
                  // The only thing this branch has to say today. A manual payment
                  // has no gateway UI and nothing to collect, and the amount is
                  // the order total, which the summary already shows — so there
                  // is nothing to render but a failed selection. Bank details
                  // would go here.
                  //
                  // Selection errors live on the setting's context, not on the
                  // order, so <Errors resource="..."> would never see them.
                  if (errors.length === 0) return <></>
                  return (
                    <PaymentSettingError data-testid="payment-setting-error">
                      {errors.map((error) => error.message).join(" ")}
                    </PaymentSettingError>
                  )
                }}
              </PaymentSettingManualPayment>
            </PaymentSettingCard>

            {/* Deliberately outside the card: the card is a <label>, and a click
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
              paymentMethods={["card", "paypal", "google_pay", "apple_pay"]}
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
          </>
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
  onChange: () => void
}): JSX.Element => {
  const { t } = useTranslation()
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
  // its own copy; this is what tells the app to catch up.
  //
  // Skipping the first run matters: on mount nothing changed, and calling in
  // would refetch the order on every render of the payment step.
  const notifiedCount = useRef(appliedCount)
  useEffect(() => {
    if (notifiedCount.current === appliedCount) return
    notifiedCount.current = appliedCount
    onChange()
  }, [appliedCount, onChange])

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
                  <span className="flex-1 font-mono break-all">{code}</span>
                  <StyledGiftCardSessionRemove
                    data-testid="gift-card-remove"
                    label={t("general.remove")}
                  />
                  <span className="font-bold">{formattedAmount}</span>
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
