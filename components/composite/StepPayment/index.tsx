import { PlaceOrderContainer } from "@commercelayer/react-components"
import "twin.macro"
import { useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import {
  StepSummary,
  StepSummaryItem,
  StepSummaryItemValue,
} from "../styled/StepSummary"

import { AppContext } from "components/data/AppProvider"
import { GTMContext } from "components/data/GTMProvider"
import { Button, ButtonWrapper } from "components/ui/Button"
import { StepContainer } from "components/ui/StepContainer"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"
import { StepLine } from "components/ui/StepLine"

import { CheckoutCustomerPayment } from "./CheckoutCustomerPayment"
import { CheckoutPayment } from "./CheckoutPayment"
import { StyledPlaceOrderButton } from "./styled"

interface Props {
  className?: string
  isActive?: boolean
  onToggleActive: () => void
}

export const StepPayment: React.FC<Props> = ({ isActive, onToggleActive }) => {
  const [canContinue, setCanContinue] = useState(false)

  const appCtx = useContext(AppContext)
  const gtmCtx = useContext(GTMContext)

  const { t } = useTranslation()

  // if (!appCtx || !appCtx.hasShippingMethod) {
  // this exit on shippingMethod is causing an error in useEffect to enable button
  if (!appCtx) {
    return null
  }

  const {
    hasPaymentMethod,
    paymentMethod,
    refetchOrder,
    isGuest,
    isPaymentRequired,
  } = appCtx

  const stripeKey = "pk_test_TYooMQauvdEDq54NiTphI7jx"

  const handleSave = async () => {
    if (gtmCtx?.fireAddPaymentInfo) {
      gtmCtx.fireAddPaymentInfo()
    }
    await refetchOrder()
  }

  const handlePlaceOrder = async () => {
    if (gtmCtx?.firePurchase) {
      gtmCtx.firePurchase()
    }
    await refetchOrder()
  }

  useEffect(() => {
    setCanContinue(!!hasPaymentMethod)
  }, [hasPaymentMethod])

  return (
    <StepContainer>
      <StepLine />
      <StepContent>
        <StepHeader
          stepNumber={3}
          status={isActive ? "edit" : "done"}
          label={t("stepPayment.title")}
          info={
            isPaymentRequired
              ? isActive
                ? t("stepPayment.summary")
                : t("stepPayment.methodSelected")
              : t("stepPayment.notRequired")
          }
          onEditRequest={() => {
            onToggleActive()
          }}
        />
        {isPaymentRequired ? (
          <div>
            {isActive ? (
              <>
                {isGuest ? (
                  <CheckoutPayment
                    handleSave={handleSave}
                    stripeKey={stripeKey}
                  />
                ) : (
                  <CheckoutCustomerPayment
                    handleSave={handleSave}
                    stripeKey={stripeKey}
                  />
                )}
                {hasPaymentMethod && (
                  <ButtonWrapper>
                    <Button
                      disabled={!canContinue}
                      data-cy="save-shipments-button"
                      onClick={handleSave}
                    >
                      {t("general.save")}
                    </Button>
                  </ButtonWrapper>
                )}
              </>
            ) : hasPaymentMethod ? (
              <>
                <StepSummary>
                  <StepSummaryItem data-cy="payment-method-selected">
                    {paymentMethod?.name}
                  </StepSummaryItem>
                  <StepSummaryItemValue data-cy="payment-method-price-selected">
                    {paymentMethod?.formattedPriceAmount}
                  </StepSummaryItemValue>
                </StepSummary>
                <PlaceOrderContainer
                  options={{
                    stripePayment: {
                      publishableKey: stripeKey,
                    },
                    savePaymentSourceToCustomerWallet: !isGuest,
                  }}
                >
                  <ButtonWrapper>
                    <StyledPlaceOrderButton
                      data-cy="place-order-button"
                      onClick={handlePlaceOrder}
                      label={t("stepPayment.submit")}
                      className="mt-8"
                    />
                  </ButtonWrapper>
                </PlaceOrderContainer>
              </>
            ) : (
              <div>{t("stepPayment.methodUnselected")}</div>
            )}
          </div>
        ) : (
          <PlaceOrderContainer
            options={{
              stripePayment: {
                publishableKey: stripeKey,
              },
              savePaymentSourceToCustomerWallet: !isGuest,
            }}
          >
            <ButtonWrapper>
              <StyledPlaceOrderButton
                data-cy="place-order-button"
                onClick={handlePlaceOrder}
                label={t("stepPayment.submit")}
                className="mt-8"
              />
            </ButtonWrapper>
          </PlaceOrderContainer>
        )}
      </StepContent>
    </StepContainer>
  )
}
