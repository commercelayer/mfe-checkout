import "@adyen/adyen-web/styles/adyen.css"
import {
  type PaymentMethodOnClickParams,
  PaymentSetting,
  PaymentSettingGiftCard,
  PaymentSettingGiftCardList,
  PaymentSettingGiftCardListItem,
  PaymentSettingName,
  PaymentSource,
  PaymentSourceBrandIcon,
  PaymentSourceBrandName,
  PaymentSourceDetail,
} from "@commercelayer/react-components"
import type { PaymentMethod as PaymentMethodType } from "@commercelayer/sdk"
import classNames from "classnames"
import { AccordionContext } from "components/data/AccordionProvider"
import { AppContext } from "components/data/AppProvider"
import { StepContainer } from "components/ui/StepContainer"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"
import { useCallback, useContext, useEffect, useState } from "react"
import { Trans, useTranslation } from "react-i18next"

import { CheckoutCustomerPayment } from "./CheckoutCustomerPayment"
import { CheckoutPayment } from "./CheckoutPayment"
import { CheckoutPaymentSessions } from "./CheckoutPaymentSessions"
import { PaymentSkeleton } from "./PaymentSkeleton"

interface HeaderProps {
  className?: string
  step: number
  info?: string
}

export const StepHeaderPayment: React.FC<HeaderProps> = ({ step }) => {
  const appCtx = useContext(AppContext)
  const accordionCtx = useContext(AccordionContext)
  const { t } = useTranslation()

  if (!appCtx || !accordionCtx) {
    return null
  }

  const { hasPaymentMethod, isPaymentRequired, isCreditCard, paymentsModel } =
    appCtx

  const recapText = () => {
    if (!isPaymentRequired) {
      return t("stepPayment.notRequired")
    }
    if (!hasPaymentMethod || accordionCtx.status === "edit") {
      return t("stepPayment.methodUnselected")
    }

    // payment_sessions model. There is no payment source to describe, so the
    // recap comes from the library's readonly mode — the counterpart of the
    // <PaymentSource readonly> used just below for the older model. Both the
    // chosen method and any gift cards appear: an order covered entirely by
    // gift cards has no method at all.
    if (paymentsModel === "payment_sessions") {
      return (
        <div className="flex flex-col">
          <PaymentSetting readonly>
            <PaymentSettingName />
          </PaymentSetting>
          <PaymentSettingGiftCard readonly>
            <PaymentSettingGiftCardList>
              <PaymentSettingGiftCardListItem>
                {({ code, formattedAmount }) => (
                  <span className="text-sm text-gray-500">
                    {code} {formattedAmount}
                  </span>
                )}
              </PaymentSettingGiftCardListItem>
            </PaymentSettingGiftCardList>
          </PaymentSettingGiftCard>
        </div>
      )
    }

    return (
      <>
        <div className="flex">
          <PaymentSource readonly loader={<PaymentSkeleton />}>
            <PaymentSourceBrandIcon className="mr-2" />
            <PaymentSourceBrandName className="mr-1">
              {({ brand }) => {
                if (isCreditCard) {
                  return (
                    <Trans i18nKey="stepPayment.endingIn">
                      {brand}
                      <PaymentSourceDetail className="ml-1" type="last4" />
                    </Trans>
                  )
                }
                return <>{brand}</>
              }}
            </PaymentSourceBrandName>
          </PaymentSource>
        </div>
      </>
    )
  }

  return (
    <StepHeader
      stepNumber={step}
      status={accordionCtx.status}
      label={t("stepPayment.title")}
      info={recapText()}
      onEditRequest={accordionCtx.setStep}
    />
  )
}

export const StepPayment: React.FC<{ isPaymentLoading: boolean }> = ({
  isPaymentLoading,
}) => {
  const appCtx = useContext(AppContext)
  const accordionCtx = useContext(AccordionContext)
  const [hasMultiplePaymentMethods, setHasMultiplePaymentMethods] =
    useState(false)
  const [autoSelected, setAutoselected] = useState(false)
  const [hasTitle, setHasTitle] = useState(true)

  const { t } = useTranslation()

  useEffect(() => {
    // If single payment methods and has multiple payment methods, we hide the label of the box
    if (autoSelected && hasMultiplePaymentMethods) {
      setHasTitle(false)
    }
  }, [autoSelected, hasMultiplePaymentMethods])

  // Both callbacks below are passed to the library <PaymentMethod>, which keys
  // an effect on them ([autoSelectSinglePaymentMethod, onClick, ...]). They
  // MUST have stable identities or that effect re-fires every render — with the
  // coupon/PayPal amount mismatch active that becomes an infinite render loop.
  // Declared above the early return to satisfy the rules of hooks; appCtx's
  // setPayment is memoised in AppProvider so [setPayment] stays stable.
  const setPayment = appCtx?.setPayment
  const selectPayment = useCallback(
    ({ payment, order }: PaymentMethodOnClickParams) => {
      if (
        // @ts-expect-error available only on adyen
        order?.payment_source?.payment_methods &&
        // @ts-expect-error available only on adyen
        order?.payment_source?.payment_methods?.length > 1
      ) {
        setHasMultiplePaymentMethods(true)
      }
      setPayment?.({ payment: payment as PaymentMethodType })
    },
    [setPayment],
  )
  const autoSelectCallback = useCallback(() => {
    setAutoselected(true)
  }, [])

  // payment_sessions model. The library has already stored the selection and
  // refetched its own order; this refreshes the app's copy so `hasPaymentMethod`
  // recomputes and the accordion can move on. Same stability requirement as the
  // callbacks above.
  const onPaymentSettingSelect = useCallback(() => {
    setPayment?.({})
  }, [setPayment])

  // if (!appCtx || !appCtx.hasShippingMethod) {
  // this exit on shippingMethod is causing an error in useEffect to enable button
  if (!appCtx || !accordionCtx) {
    return null
  }

  const { isGuest, isPaymentRequired, hasSubscriptions } = appCtx

  return (
    <StepContainer
      className={classNames({
        current: accordionCtx.isActive,
        done: !accordionCtx.isActive,
      })}
    >
      <StepContent>
        <>
          {accordionCtx.isActive && (
            <div>
              {isPaymentRequired ? (
                <>
                  {/* Both payment models are mounted together. Each library
                      tree reads the order and renders nothing when it is not
                      on its own model, so there is no conditional to keep in
                      sync here — and none of the older, guest/customer
                      branching applies to the newer model. */}
                  <CheckoutPaymentSessions onSelect={onPaymentSettingSelect} />
                  {isGuest ? (
                    <CheckoutPayment
                      isPaymentLoading={isPaymentLoading}
                      selectPayment={selectPayment}
                      autoSelectCallback={autoSelectCallback}
                      hasTitle={hasTitle}
                    />
                  ) : (
                    <CheckoutCustomerPayment
                      isPaymentLoading={isPaymentLoading}
                      selectPayment={selectPayment}
                      autoSelectCallback={autoSelectCallback}
                      hasTitle={hasTitle}
                      hasSubscriptions={hasSubscriptions}
                    />
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-400">
                  {t("stepPayment.amountZero")}
                </p>
              )}
            </div>
          )}
        </>
      </StepContent>
    </StepContainer>
  )
}
