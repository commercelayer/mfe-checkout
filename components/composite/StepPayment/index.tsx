import {
  PaymentSourceBrandName,
  PaymentSourceDetail,
  PaymentSource,
  PaymentSourceBrandIcon,
} from "@commercelayer/react-components"
import "twin.macro"
import classNames from "classnames"
import { useContext } from "react"
import { Trans, useTranslation } from "react-i18next"

import { AccordionContext } from "components/data/AccordionProvider"
import { AppContext } from "components/data/AppProvider"
import { StepContainer } from "components/ui/StepContainer"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"

import { CheckoutCustomerPayment } from "./CheckoutCustomerPayment"
import { CheckoutPayment } from "./CheckoutPayment"
import { PaymentSkeleton } from "./PaymentSkeleton"

interface HeaderProps {
  className?: string
  step: number
  info?: string
}

export const StepHeaderPayment: React.FC<HeaderProps> = ({ step }) => {
  const appCtx = useContext(AppContext)
  const accordionCtx = useContext(AccordionContext)

  if (!appCtx || !accordionCtx) {
    return null
  }

  const { hasPaymentMethod, isPaymentRequired, paymentMethod } = appCtx

  const { t } = useTranslation()

  const isCreditCard = () => {
    return paymentMethod?.paymentSourceType === "stripe_payments"
  }

  const recapText = () => {
    if (!isPaymentRequired) {
      return t("stepPayment.notRequired")
    }
    if (!hasPaymentMethod) {
      return t("stepPayment.methodUnselected")
    }

    return (
      <>
        <div className="flex">
          <PaymentSource readonly loader={<PaymentSkeleton />}>
            <PaymentSourceBrandIcon className="mr-2" />
            <PaymentSourceBrandName className="mr-1">
              {({ brand }) => {
                if (isCreditCard()) {
                  return (
                    <Trans t={t} i18nKey="stepPayment.endingIn">
                      {brand}
                      <PaymentSourceDetail className="ml-1" type="last4" />
                    </Trans>
                  )
                }
                return brand
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

export const StepPayment: React.FC = () => {
  const appCtx = useContext(AppContext)
  const accordionCtx = useContext(AccordionContext)

  // if (!appCtx || !appCtx.hasShippingMethod) {
  // this exit on shippingMethod is causing an error in useEffect to enable button
  if (!appCtx || !accordionCtx) {
    return null
  }

  const { isGuest, isPaymentRequired, refetchOrder } = appCtx

  return (
    <StepContainer
      className={classNames({
        current: accordionCtx.isActive,
        done: !accordionCtx.isActive,
      })}
    >
      <StepContent>
        {isPaymentRequired && (
          <div>
            {accordionCtx.isActive && (
              <>
                {isGuest ? (
                  <CheckoutPayment refetchOrder={refetchOrder} />
                ) : (
                  <CheckoutCustomerPayment refetchOrder={refetchOrder} />
                )}
              </>
            )}
          </div>
        )}
      </StepContent>
    </StepContainer>
  )
}
