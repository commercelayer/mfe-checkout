import {
  PaymentSourceBrandName,
  PaymentSourceDetail,
  PaymentSource,
  PaymentMethodsContainer,
  PaymentSourceBrandIcon,
} from "@commercelayer/react-components"
import "twin.macro"
import classNames from "classnames"
import { useContext } from "react"
import { Trans, useTranslation } from "react-i18next"

import { AccordionContext } from "components/data/AccordionProvider"
import { AppContext } from "components/data/AppProvider"
import { GTMContext } from "components/data/GTMProvider"
import { StepContainer } from "components/ui/StepContainer"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"

import { CheckoutCustomerPayment } from "./CheckoutCustomerPayment"
import { CheckoutPayment } from "./CheckoutPayment"

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

  const { hasPaymentMethod, isPaymentRequired } = appCtx

  const { t } = useTranslation()

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
          <PaymentMethodsContainer>
            <PaymentSource readonly>
              <PaymentSourceBrandIcon className="mr-2" />
              <PaymentSourceBrandName className="mr-1">
                {({ brand }) => {
                  if (
                    brand.includes("Wire transfer") ||
                    brand.includes("Paypal")
                  ) {
                    return brand
                  }
                  return (
                    <Trans t={t} i18nKey="stepPayment.endingIn">
                      {brand}
                      <PaymentSourceDetail className="ml-1" type="last4" />
                    </Trans>
                  )
                }}
              </PaymentSourceBrandName>
            </PaymentSource>
          </PaymentMethodsContainer>
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
  const gtmCtx = useContext(GTMContext)
  const accordionCtx = useContext(AccordionContext)

  // if (!appCtx || !appCtx.hasShippingMethod) {
  // this exit on shippingMethod is causing an error in useEffect to enable button
  if (!appCtx || !accordionCtx) {
    return null
  }

  const { refetchOrder, isGuest, isPaymentRequired } = appCtx

  const handleSave = async () => {
    if (gtmCtx?.fireAddPaymentInfo) {
      gtmCtx.fireAddPaymentInfo()
    }
    await refetchOrder()
  }

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
                  <CheckoutPayment handleSave={handleSave} />
                ) : (
                  <CheckoutCustomerPayment handleSave={handleSave} />
                )}
              </>
            )}
          </div>
        )}
      </StepContent>
    </StepContainer>
  )
}
