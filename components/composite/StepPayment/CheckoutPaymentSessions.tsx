import {
  PaymentSetting,
  PaymentSettingGiftCard,
  PaymentSettingGiftCardList,
  PaymentSettingGiftCardListItem,
  PaymentSettingManualPayment,
  PaymentSettingName,
} from "@commercelayer/react-components"
import type { JSX } from "react"
import { useTranslation } from "react-i18next"

import {
  GiftCardInputRow,
  GiftCardRow,
  GiftCardTitle,
  GiftCardWrapper,
  PaymentSettingError,
  PaymentSettingItem,
  PaymentWrapper,
  StyledGiftCardSessionAdd,
  StyledGiftCardSessionInput,
  StyledGiftCardSessionRemove,
  StyledGiftCardSessionSubmit,
  StyledPaymentSettingRadioButton,
} from "./styled"

interface Props {
  /**
   * Called once the selection has been stored on the order, so the app can
   * refetch and recompute whether the payment step is complete.
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
 * Everything visible therefore lives *inside* `<PaymentSetting>`, rendered once
 * per setting — the same shape as the older tree, where the wrapper belongs to
 * each payment method rather than to the list. Markup placed outside would show
 * an empty box on every order that is not on this model.
 *
 * Only `payment_setting_manuals` is implemented so far — other settings are
 * skipped by `<PaymentSetting>` rather than rendered inert.
 */
export const CheckoutPaymentSessions = ({ onSelect }: Props): JSX.Element => {
  // Reuses the existing gift card keys rather than adding new ones: a new
  // string means a new entry in every locale.
  const { t } = useTranslation()

  return (
    <>
      {/* Gift cards sit outside <PaymentSetting>: they are additive, not one of
          the alternatives the radio group picks between, and several can be
          active at once. They also stay visible once they cover the order,
          which is when the method selector disappears — otherwise a shopper
          could not take one back off. */}
      <PaymentSettingGiftCard>
        <GiftCardWrapper data-testid="gift-card-sessions">
          <GiftCardTitle>{t("orderRecap.giftcard_amount")}</GiftCardTitle>
          <PaymentSettingGiftCardList>
            <PaymentSettingGiftCardListItem>
              {({ code, formattedAmount }) => (
                <GiftCardRow data-testid="gift-card-session">
                  <span className="flex-1 font-mono">{code}</span>
                  <span>{formattedAmount}</span>
                  <StyledGiftCardSessionRemove data-testid="gift-card-remove" />
                </GiftCardRow>
              )}
            </PaymentSettingGiftCardListItem>
          </PaymentSettingGiftCardList>
          <GiftCardInputRow>
            <StyledGiftCardSessionInput
              data-testid="gift-card-input"
              placeholder={t("orderRecap.gift_card_code")}
            />
            <StyledGiftCardSessionSubmit data-testid="gift-card-apply" />
          </GiftCardInputRow>
          <StyledGiftCardSessionAdd data-testid="gift-card-add" />
        </GiftCardWrapper>
      </PaymentSettingGiftCard>

      <PaymentSetting onSelect={onSelect}>
        <PaymentWrapper data-testid="payment-settings-container">
          <PaymentSettingItem data-testid="payment-setting-item">
            <StyledPaymentSettingRadioButton className="form-radio mr-2" />
            <PaymentSettingName />
          </PaymentSettingItem>
          <PaymentSettingManualPayment>
            {({ errors }) => {
              // The only thing this branch has to say today. A manual payment has
              // no gateway UI and nothing to collect, and the amount is the order
              // total, which the summary already shows — so there is nothing to
              // render but a failed selection. Bank details would go here.
              //
              // Selection errors live on the setting's context, not on the order,
              // so <Errors resource="..."> would never see them.
              if (errors.length === 0) return <></>
              return (
                <PaymentSettingError data-testid="payment-setting-error">
                  {errors.map((error) => error.message).join(" ")}
                </PaymentSettingError>
              )
            }}
          </PaymentSettingManualPayment>
        </PaymentWrapper>
      </PaymentSetting>
    </>
  )
}
