import {
  GiftCardOrCouponCode,
  GiftCardOrCouponInput,
  GiftCardOrCouponSubmit,
  Errors,
  GiftCardOrCouponForm,
} from "@commercelayer/react-components"
import { useContext, useState } from "react"
import { useTranslation } from "react-i18next"

import { AppContext } from "components/data/AppProvider"

import {
  CouponFormWrapper,
  CouponFieldWrapper,
  CouponName,
  CouponRecap,
  StyledGiftCardOrCouponRemoveButton,
} from "./styled"

import "twin.macro"
import { ErrorComponentProps } from "@commercelayer/react-components/dist/typings/errors"

export const CouponOrGiftCard: React.FC = () => {
  const { t } = useTranslation()

  const appCtx = useContext(AppContext)

  if (!appCtx) {
    return null
  }

  const { refetchOrder } = appCtx

  const [codeError, setCodeError] = useState(false)

  const handleSubmit = async ({ success }: { success: boolean }) => {
    if (!success) return setCodeError(true)
    if (success) {
      // soluzione momentanea in vista di una risoluzione di @commercelayer/react-components
      setTimeout(() => {
        refetchOrder()
      }, 2000)
    }
    return setCodeError(false)
  }

  const classError = codeError
    ? "inline-block text-sm pt-3 border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
    : ""

  const messages: ErrorComponentProps["messages"] = [
    {
      code: "VALIDATION_ERROR",
      resource: "order",
      field: "giftCardOrCouponCode",
      message: t("input.mustBeValidCouponOrGiftCard"),
    },
  ]

  return (
    <>
      <GiftCardOrCouponForm onSubmit={handleSubmit}>
        <CouponFormWrapper>
          <CouponFieldWrapper>
            <GiftCardOrCouponInput
              data-cy="input_giftcard_coupon"
              className={`${classError} form-input block w-full rounded-none rounded-l-md text-sm border-gray-400 border p-3 transition duration-500 ease-in-out focus:border-primary focus:ring focus:ring-offset-0 focus:ring-primary-light focus:ring-opacity-50`}
              placeholder="Coupon code"
            />
            <GiftCardOrCouponSubmit
              data-cy="submit_giftcard_coupon"
              label="Apply"
              className={`w-auto -ml-px relative inline-flex items-center space-x-2 px-8 py-3 text-xs font-extrabold text-white bg-primary border border-transparent rounded-r-md hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50`}
            />
          </CouponFieldWrapper>
          <Errors
            className={classError}
            resource="order"
            field="giftCardOrCouponCode"
            messages={messages}
          />
        </CouponFormWrapper>
      </GiftCardOrCouponForm>

      <GiftCardOrCouponCode type="coupon" className="inline-flex items-center">
        {(props) => {
          const { hide, code, ...p } = props
          return hide ? null : (
            <CouponRecap>
              <span data-cy="code-coupon" {...p}>
                <CouponName>{code}</CouponName>
                <StyledGiftCardOrCouponRemoveButton
                  data-cy="remove_coupon"
                  type="coupon"
                  label="Remove"
                  onClick={refetchOrder}
                />
              </span>
            </CouponRecap>
          )
        }}
      </GiftCardOrCouponCode>
      <GiftCardOrCouponCode
        type="giftCard"
        className="inline-flex items-center text-sm font-medium"
      >
        {(props) => {
          const { hide, code, ...p } = props
          return hide ? null : (
            <CouponRecap>
              <span data-cy="code-giftcard" {...p}>
                {code}
                <StyledGiftCardOrCouponRemoveButton
                  data-cy="remove_giftcard"
                  type="giftCard"
                  className=""
                  label="Remove"
                  onClick={refetchOrder}
                />
              </span>
            </CouponRecap>
          )
        }}
      </GiftCardOrCouponCode>
    </>
  )
}
