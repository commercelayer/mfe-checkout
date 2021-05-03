import {
  GiftCardOrCouponCode,
  GiftCardOrCouponRemoveButton,
  DiscountAmount,
  GiftCardAmount,
  GiftCardOrCouponInput,
  GiftCardOrCouponSubmit,
  Errors,
  GiftCardOrCouponForm,
} from "@commercelayer/react-components"
import { useContext, useState } from "react"
import { useTranslation } from "react-i18next"

import { AppContext } from "components/data/AppProvider"
import * as S from "components/ui"
import "twin.macro"

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

  const removeIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )

  const labelButton = (
    <>
      <svg
        className="w-5 h-5 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14 5l7 7m0 0l-7 7m7-7H3"
        />
      </svg>
    </>
  )
  return (
    <>
      <GiftCardOrCouponForm onSubmit={handleSubmit}>
        <S.LayoutGiftCardOrCouponForm
          codeError={codeError}
          input={(props) => {
            return (
              <GiftCardOrCouponInput
                data-cy="input_giftcard_coupon"
                {...props}
              />
            )
          }}
          submit={(props) => {
            return (
              <GiftCardOrCouponSubmit
                data-cy="submit_giftcard_coupon"
                label={labelButton}
                {...props}
              />
            )
          }}
          error={(props) => {
            return (
              <Errors
                resource="order"
                field="giftCardOrCouponCode"
                {...props}
              />
            )
          }}
        />
      </GiftCardOrCouponForm>
      <S.LayoutGiftCardOrCouponView>
        {(props) => {
          const {
            giftCardOrCouponCodeClass,
            giftCardOrCouponRemoveButtonClass,
          } = props

          return (
            <GiftCardOrCouponCode
              type="coupon"
              className={giftCardOrCouponCodeClass}
            >
              {(props) => {
                const { hide, code, ...rest } = props
                return hide ? null : (
                  <>
                    <span data-cy="code-coupon" {...rest}>
                      {code}
                      <GiftCardOrCouponRemoveButton
                        data-cy="remove_coupon"
                        type="coupon"
                        className={giftCardOrCouponRemoveButtonClass}
                        label={removeIcon}
                        onClick={refetchOrder}
                      />
                    </span>
                  </>
                )
              }}
            </GiftCardOrCouponCode>
          )
        }}
      </S.LayoutGiftCardOrCouponView>
      <S.LayoutGiftCardOrCouponView>
        {(props) => {
          const {
            giftCardOrCouponCodeClass,
            giftCardOrCouponRemoveButtonClass,
          } = props

          return (
            <GiftCardOrCouponCode
              type="giftCard"
              className={giftCardOrCouponCodeClass}
            >
              {(props) => {
                const { hide, code, ...rest } = props
                return hide ? null : (
                  <>
                    <span data-cy="code-giftcard" {...rest}>
                      {code}
                      <GiftCardOrCouponRemoveButton
                        data-cy="remove_giftcard"
                        type="giftCard"
                        className={giftCardOrCouponRemoveButtonClass}
                        label={removeIcon}
                        onClick={refetchOrder}
                      />
                    </span>
                  </>
                )
              }}
            </GiftCardOrCouponCode>
          )
        }}
      </S.LayoutGiftCardOrCouponView>
      <GiftCardOrCouponCode type="coupon">
        {(props) => {
          const { hide } = props
          return hide ? null : (
            <S.LayoutBaseAmount
              main={
                <>
                  {t("orderRecap.discount_amount")}
                  <DiscountAmount data-cy="discount-amount" />
                </>
              }
            />
          )
        }}
      </GiftCardOrCouponCode>
      <GiftCardOrCouponCode type="giftCard">
        {(props) => {
          const { hide } = props
          return hide ? null : (
            <S.LayoutBaseAmount
              main={
                <>
                  {t("orderRecap.giftcard_amount")}
                  <GiftCardAmount data-cy="giftcard-amount" />
                </>
              }
            />
          )
        }}
      </GiftCardOrCouponCode>
    </>
  )
}
