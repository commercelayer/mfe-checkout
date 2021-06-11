import {
  PaymentSourceBrandName,
  PaymentSourceDetail,
  PaymentSource,
  PaymentMethodsContainer,
  PaymentSourceBrandIcon,
} from "@commercelayer/react-components"
import "twin.macro"
import classNames from "classnames"
import { useContext, useEffect, useState } from "react"
import { Trans, useTranslation } from "react-i18next"

import {
  StepSummary,
  StepSummaryItem,
  StepSummaryItemValue,
} from "../styled/StepSummary"

import { AppContext } from "components/data/AppProvider"
import { GTMContext } from "components/data/GTMProvider"
import { Button, ButtonWrapper } from "components/ui/Button"
import { SpinnerIcon } from "components/ui/SpinnerIcon"
import { StepContainer } from "components/ui/StepContainer"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"

import { CheckoutCustomerPayment } from "./CheckoutCustomerPayment"
import { CheckoutPayment } from "./CheckoutPayment"

interface Props {
  isActive?: boolean
}

interface HeaderProps {
  className?: string
  isActive?: boolean
  onToggleActive?: () => void
  step: number
  status?: "done" | "edit" | "disabled"
  info?: string
}

export const StepHeaderPayment: React.FC<HeaderProps> = ({
  isActive,
  onToggleActive,
  step,
  status,
}) => {
  const appCtx = useContext(AppContext)

  if (!appCtx) {
    return null
  }

  const { hasPaymentMethod, paymentMethod, isPaymentRequired } = appCtx

  const { t } = useTranslation()

  const recapText = () => {
    if (!isPaymentRequired) {
      t("stepPayment.notRequired")
    }
    if (!hasPaymentMethod) {
      t("stepPayment.methodUnselected")
    }

    return (
      <>
        <StepSummary>
          <StepSummaryItem data-cy="payment-method-selected">
            <PaymentMethodsContainer>
              <PaymentSource readonly>
                <PaymentSourceBrandIcon className="mr-2" />
                <Trans t={t} i18nKey="stepPayment.endingIn">
                  <PaymentSourceBrandName className="mr-1" />
                  <PaymentSourceDetail className="ml-1" type="last4" />
                </Trans>
              </PaymentSource>
            </PaymentMethodsContainer>
          </StepSummaryItem>
          <StepSummaryItemValue data-cy="payment-method-price-selected">
            {paymentMethod?.formattedPriceAmount}
          </StepSummaryItemValue>
        </StepSummary>
      </>
    )
  }

  return (
    <StepHeader
      stepNumber={step}
      status={status || isActive ? "edit" : "done"}
      label={t("stepPayment.title")}
      info={recapText()}
      onEditRequest={
        onToggleActive
          ? () => {
              onToggleActive()
            }
          : undefined
      }
    />
  )
}

export const StepPayment: React.FC<Props> = ({ isActive }) => {
  const [canContinue, setCanContinue] = useState(false)
  const [isLocalLoader, setIsLocalLoader] = useState(false)
  const appCtx = useContext(AppContext)
  const gtmCtx = useContext(GTMContext)

  const { t } = useTranslation()

  // if (!appCtx || !appCtx.hasShippingMethod) {
  // this exit on shippingMethod is causing an error in useEffect to enable button
  if (!appCtx) {
    return null
  }

  const { hasPaymentMethod, refetchOrder, isGuest, isPaymentRequired } = appCtx

  const handleSave = async () => {
    setIsLocalLoader(true)
    if (gtmCtx?.fireAddPaymentInfo) {
      gtmCtx.fireAddPaymentInfo()
    }
    await refetchOrder()
    setIsLocalLoader(false)
  }

  useEffect(() => {
    setCanContinue(!!hasPaymentMethod)
  }, [hasPaymentMethod])

  return (
    <StepContainer
      className={classNames({
        current: isActive,
        done: !isActive,
      })}
    >
      <StepContent>
        {isPaymentRequired && (
          <div>
            {isActive && (
              <>
                {isGuest ? (
                  <CheckoutPayment handleSave={handleSave} />
                ) : (
                  <CheckoutCustomerPayment handleSave={handleSave} />
                )}
                {hasPaymentMethod && (
                  <ButtonWrapper>
                    <Button
                      disabled={!canContinue}
                      data-cy="save-payment-button"
                      onClick={handleSave}
                    >
                      {isLocalLoader && <SpinnerIcon />}
                      {t("general.save")}
                    </Button>
                  </ButtonWrapper>
                )}
              </>
            )}
          </div>
        )}
      </StepContent>
    </StepContainer>
  )
}
