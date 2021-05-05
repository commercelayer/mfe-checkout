import {
  PlaceOrderButton,
  PlaceOrderContainer,
} from "@commercelayer/react-components"
import { faWallet } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "twin.macro"

import { useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { AppContext } from "components/data/AppProvider"
import { GTMContext } from "components/data/GTMProvider"
import { Button } from "components/ui/Button"
import { Icon } from "components/ui/Icon"
import { StepContainer } from "components/ui/StepContainer"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"
import { StepLine } from "components/ui/StepLine"

import { CheckoutCustomerPayment } from "./CheckoutCustomerPayment"
import { CheckoutPayment } from "./CheckoutPayment"

interface Props {
  className?: string
  isActive?: boolean
  onToggleActive: () => void
}

export const StepPayment: React.FC<Props> = ({
  className,
  isActive,
  onToggleActive,
}) => {
  const [canContinue, setCanContinue] = useState(false)

  const appCtx = useContext(AppContext)
  const gtmCtx = useContext(GTMContext)

  const { t } = useTranslation()

  if (!appCtx || !appCtx.hasShippingMethod) {
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
    setCanContinue(hasPaymentMethod)
  }, [])

  return (
    <StepContainer>
      <StepLine />
      <StepContent>
        <StepHeader
          stepNumber={2}
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
                  <div tw="flex justify-end pt-3">
                    <Button
                      disabled={!canContinue}
                      data-cy="save-shipments-button"
                      onClick={handleSave}
                    >
                      {t("general.save")}
                    </Button>
                  </div>
                )}
              </>
            ) : hasPaymentMethod ? (
              <>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex">
                    <Icon>
                      <FontAwesomeIcon icon={faWallet} />
                    </Icon>
                    <p data-cy="payment-method-selected" className="font-bold">
                      {paymentMethod?.name}
                    </p>
                  </div>
                  <p data-cy="payment-method-price-selected">
                    {paymentMethod?.formattedPriceAmount}
                  </p>
                </div>
                <PlaceOrderContainer
                  options={{
                    stripePayment: {
                      publishableKey: stripeKey,
                    },
                    savePaymentSourceToCustomerWallet: !isGuest,
                  }}
                >
                  <div tw="flex justify-end">
                    <PlaceOrderButton
                      data-cy="place-order-button"
                      onClick={handlePlaceOrder}
                      className="inline-flex items-center px-3 py-2 mt-5 text-sm font-medium text-white border border-transparent bg-primary leading-4 rounded-md shadow-sm hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                      label={t("stepPayment.submit")}
                    />
                  </div>
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
            <div tw="flex justify-end">
              <PlaceOrderButton
                data-cy="place-order-button"
                onClick={handlePlaceOrder}
                className="inline-flex items-center px-3 py-2 mt-5 text-sm font-medium text-white border border-transparent bg-primary leading-4 rounded-md shadow-sm hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                label={t("stepPayment.submit")}
              />
            </div>
          </PlaceOrderContainer>
        )}
      </StepContent>
    </StepContainer>
  )
}
