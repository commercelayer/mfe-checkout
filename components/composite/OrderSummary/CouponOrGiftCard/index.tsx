import {
  GiftCardOrCouponCode,
  GiftCardOrCouponSubmit,
  GiftCardOrCouponForm,
  ErrorComponentProps,
} from "@commercelayer/react-components"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import {
  CouponFormWrapper,
  CouponFieldWrapper,
  CouponName,
  CouponRecap,
  StyledGiftCardOrCouponRemoveButton,
  StyledGiftCardOrCouponInput,
  StyledErrors,
} from "./styled"

interface Props {
  readonly?: boolean
  setCouponOrGiftCard: () => Promise<void>
}

export const CouponOrGiftCard: React.FC<Props> = ({
  readonly,
  setCouponOrGiftCard,
}) => {
  const { t } = useTranslation()

  const [codeError, setCodeError] = useState(false)

  const handleSubmit = async (success: { success?: any }) => {
    if (!success && success !== undefined) return setCodeError(true)
    await setCouponOrGiftCard()
    return setCodeError(false)
  }

  const classError = codeError ? "hasError" : ""

  const messages: ErrorComponentProps["messages"] = [
    {
      code: "VALIDATION_ERROR",
      resource: "orders",
      field: "giftCardOrCouponCode",
      message: t("input.mustBeValidCouponOrGiftCard"),
    },
  ]

  return (
    <>
      {!readonly && (
        <GiftCardOrCouponForm onSubmit={handleSubmit}>
          <CouponFormWrapper>
            <CouponFieldWrapper>
              <StyledGiftCardOrCouponInput
                data-cy="input_giftcard_coupon"
                className={`form-input ${classError}`}
                placeholder={t("orderRecap.couponCode")}
              />
              <GiftCardOrCouponSubmit
                data-cy="submit_giftcard_coupon"
                label={t("general.apply")}
                className={`w-auto -ml-px relative inline-flex items-center space-x-2 px-8 py-3 text-xs font-extrabold text-contrast bg-primary border border-transparent rounded-r-md hover:opacity-80 focus:outline-none`}
              />
            </CouponFieldWrapper>
            <StyledErrors
              resource="orders"
              field="giftCardOrCouponCode"
              messages={messages}
            />
          </CouponFormWrapper>
        </GiftCardOrCouponForm>
      )}

      <GiftCardOrCouponCode type="coupon" className="inline-flex items-center">
        {(props) => {
          const { hide, code, ...p } = props
          return hide ? null : (
            <CouponRecap>
              <span data-cy="code-coupon" {...p}>
                <CouponName>{code}</CouponName>
                <StyledGiftCardOrCouponRemoveButton
                  onClick={handleSubmit}
                  data-cy="remove_coupon"
                  type="coupon"
                  label="Remove"
                />
              </span>
            </CouponRecap>
          )
        }}
      </GiftCardOrCouponCode>
      <GiftCardOrCouponCode
        type="gift_card"
        className="inline-flex items-center text-sm font-medium"
      >
        {(props) => {
          const { hide, code, ...p } = props
          return hide ? null : (
            <CouponRecap>
              <span data-cy="code-giftcard" {...p}>
                {code}
                <StyledGiftCardOrCouponRemoveButton
                  onClick={setCouponOrGiftCard}
                  data-cy="remove_giftcard"
                  type="gift_card"
                  className=""
                  label="Remove"
                />
              </span>
            </CouponRecap>
          )
        }}
      </GiftCardOrCouponCode>
    </>
  )
}
