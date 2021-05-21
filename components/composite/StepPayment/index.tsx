import {
  PaymentSourceBrandName,
  PaymentSourceDetail,
  PlaceOrderContainer,
  PaymentSource,
  PaymentMethodsContainer,
} from "@commercelayer/react-components"
import "twin.macro"
import { ErrorComponentProps } from "@commercelayer/react-components/dist/typings/errors"
import classNames from "classnames"
import { useContext, useEffect, useState } from "react"
import { Trans, useTranslation } from "react-i18next"

import { StyledErrors } from "../OrderSummary/CouponOrGiftCard/styled"
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
  const [isLocalLoader, setIsLocalLoader] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

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

  const messages: ErrorComponentProps["messages"] = [
    {
      code: "VALIDATION_ERROR",
      resource: "order",
      message: t("general.systemError"),
    },
  ]

  const handleSave = async () => {
    setIsLocalLoader(true)
    if (gtmCtx?.fireAddPaymentInfo) {
      gtmCtx.fireAddPaymentInfo()
    }
    await refetchOrder()
    setIsLocalLoader(false)
  }

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true)
    if (gtmCtx?.firePurchase) {
      gtmCtx.firePurchase()
    }
    await refetchOrder()
    setIsPlacingOrder(false)
  }

  useEffect(() => {
    setCanContinue(!!hasPaymentMethod)
  }, [hasPaymentMethod])

  return (
    <>
      <StepContainer
        className={classNames({
          current: isActive,
          done: !isActive,
        })}
      >
        <StepLine stepNumber={3} status={isActive ? "edit" : "done"} />
        <StepContent>
          <StepHeader
            stepNumber={3}
            status={isActive ? "edit" : hasPaymentMethod ? "done" : "disabled"}
            label={t("stepPayment.title")}
            info={
              isPaymentRequired
                ? isActive
                  ? t("stepPayment.summary")
                  : hasPaymentMethod
                  ? t("stepPayment.methodSelected")
                  : t("stepPayment.methodUnselected")
                : t("stepPayment.notRequired")
            }
            onEditRequest={() => {
              onToggleActive()
            }}
          />
          {isPaymentRequired && (
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
                        data-cy="save-payment-button"
                        onClick={handleSave}
                      >
                        {isLocalLoader && <SpinnerIcon />}
                        {t("general.save")}
                      </Button>
                    </ButtonWrapper>
                  )}
                </>
              ) : (
                hasPaymentMethod && (
                  <>
                    <StepSummary>
                      <StepSummaryItem data-cy="payment-method-selected">
                        <PaymentMethodsContainer>
                          <PaymentSource readonly>
                            <Trans t={t} i18nKey="stepPayment.endingIn">
                              <PaymentSourceBrandName className="mr-1" />
                              <PaymentSourceDetail
                                className="ml-1"
                                type="last4"
                              />
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
              )}
            </div>
          )}
        </StepContent>
      </StepContainer>
      {((isPaymentRequired && !isActive && hasPaymentMethod) ||
        !isPaymentRequired) && (
        <>
          <StyledErrors resource="order" messages={messages} />
          <StyledErrors resource="order" field="status" />
          <StyledErrors resource="order" field="base" />
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
                label={
                  <>
                    {isPlacingOrder && <SpinnerIcon />}
                    {t("stepPayment.submit")}
                  </>
                }
              />
            </ButtonWrapper>
          </PlaceOrderContainer>
        </>
      )}
    </>
  )
}
