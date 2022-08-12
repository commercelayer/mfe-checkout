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

  const handleSubmit = async (response: {
    success: boolean
    value?: string
  }) => {
    if (!response.success) {
      return setCodeError(response.value?.length !== 0)
    }
    await setCouponOrGiftCard()
    return setCodeError(false)
  }

  const classError = codeError ? "hasError" : ""

  const messages: ErrorComponentProps["messages"] = [
    {
      code: "VALIDATION_ERROR",
      resource: "orders",
      field: "gift_card_or_coupon_code",
      message: t("input.mustBeValidCouponOrGiftCard"),
    },
    {
      code: "VALIDATION_ERROR",
      resource: "orders",
      field: "coupon_code",
      message: t("input.mustBeValidCoupon"),
    },
    {
      code: "VALIDATION_ERROR",
      resource: "orders",
      field: "gift_card_code",
      message: t("input.mustBeValidGiftCard"),
    },
    {
      code: "EMPTY_ERROR",
      resource: "orders",
      field: "customer_email",
      message: " ",
    },
    {
      code: "VALIDATION_ERROR",
      resource: "orders",
      field: "braintree_payments",
      message: " ",
    },
    {
      code: "VALIDATION_ERROR",
      resource: "orders",
      field: "adyen_payments",
      message: " ",
    },
    {
      code: "VALIDATION_ERROR",
      resource: "orders",
      field: "paypal_payments",
      message: " ",
    },
  ]

  return (
    <>
      {!readonly && (
        <GiftCardOrCouponForm onSubmit={handleSubmit}>
          <CouponFormWrapper>
            <CouponFieldWrapper>
              <StyledGiftCardOrCouponInput
                data-test-id="input_giftcard_coupon"
                className={`form-input ${classError}`}
                required={false}
                placeholderTranslation={(codeType) =>
                  t(`orderRecap.${codeType}`)
                }
              />
              <GiftCardOrCouponSubmit
                data-test-id="submit_giftcard_coupon"
                label={t("general.apply")}
                className={`w-auto -ml-px relative inline-flex items-center space-x-2 px-8 py-3 text-xs font-extrabold text-contrast bg-primary border border-transparent rounded-r-md hover:opacity-80 focus:outline-none`}
              />
            </CouponFieldWrapper>
            <StyledErrors
              data-test-id="discount-error"
              resource="orders"
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
              <span data-test-id="code-coupon" {...p}>
                <CouponName>{code}</CouponName>
                {!readonly && (
                  <StyledGiftCardOrCouponRemoveButton
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    onClick={handleSubmit}
                    data-test-id="remove_coupon"
                    type="coupon"
                    label="Remove"
                  />
                )}
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
              <span data-test-id="code-giftcard" {...p}>
                {code}
                {!readonly && (
                  <StyledGiftCardOrCouponRemoveButton
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    onClick={handleSubmit}
                    data-test-id="remove_giftcard"
                    type="gift_card"
                    className=""
                    label="Remove"
                  />
                )}
              </span>
            </CouponRecap>
          )
        }}
      </GiftCardOrCouponCode>
    </>
  )
}
