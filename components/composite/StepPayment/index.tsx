import {
  PlaceOrderButton,
  PlaceOrderContainer,
} from "@commercelayer/react-components"
import { faWallet } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "twin.macro"

import { AppContext } from "components/data/AppProvider"
import { GTMContext } from "components/data/GTMProvider"
import { Icon } from "components/ui/Icon"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"
import { useContext } from "react"
import { useTranslation } from "react-i18next"

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
  const appCtx = useContext(AppContext)
  const gtmCtx = useContext(GTMContext)

  const { t } = useTranslation()

  if (!appCtx || !appCtx.hasShippingMethod) {
    return null
  }

  const { hasPaymentMethod, paymentMethod, refetchOrder, isGuest } = appCtx

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

  return (
    <div className={className}>
      <StepHeader
        stepNumber={2}
        status={isActive ? "edit" : "done"}
        label={t("stepPayment.title")}
        info={
          isActive ? t("stepPayment.summary") : t("stepPayment.methodSelected")
        }
        onEditRequest={() => {
          onToggleActive()
        }}
      />
      <StepContent>
        {isActive ? (
          isGuest ? (
            <CheckoutPayment handleSave={handleSave} stripeKey={stripeKey} />
          ) : (
            <CheckoutCustomerPayment
              handleSave={handleSave}
              stripeKey={stripeKey}
            />
          )
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
              <div>
                <PlaceOrderButton
                  data-cy="place-order-button"
                  onClick={handlePlaceOrder}
                  className="inline-flex items-center px-3 py-2 mt-5 text-sm font-medium text-white border border-transparent bg-primary leading-4 rounded-md shadow-sm hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  label={t("stepPayment.submit")}
                />
              </div>
            </PlaceOrderContainer>
          </>
        ) : (
          <div>{t("stepPayment.methodUnselected")}</div>
        )}
      </StepContent>
    </div>
  )
}
