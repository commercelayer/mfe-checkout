import { useContext } from "react"
import {
  PaymentMethod,
  PaymentMethodName,
  PaymentMethodPrice,
  PaymentMethodRadioButton,
  PaymentMethodsContainer,
  PaymentSource,
  PlaceOrderButton,
  PlaceOrderContainer,
} from "@commercelayer/react-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWallet } from "@fortawesome/free-solid-svg-icons"
import "twin.macro"

import { AppContext } from "components/data/AppProvider"
import { useTranslation } from "components/data/i18n"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"
import { Icon } from "components/ui/Icon"
import { ButtonCss } from "components/ui/Button"
import { GTMContext } from "components/data/GTMProvider"
import styled from "styled-components"

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

  const { hasPaymentMethod, paymentMethod, refetchOrder } = appCtx

  const stripeKey = "pk_test_TYooMQauvdEDq54NiTphI7jx"

  const handleSave = async () => {
    if (gtmCtx?.fireAddPaymentInfo) {
      gtmCtx.fireAddPaymentInfo()
    }
  }

  const handlePlaceOrder = async () => {
    await refetchOrder()
    if (gtmCtx?.firePurchase) {
      gtmCtx.firePurchase()
    }
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
          <>
            <PaymentMethodsContainer
              config={{
                stripePayment: {
                  publishableKey: stripeKey,
                  submitLabel: t("stepPayment.setPaymentMethod"),
                  submitClassName:
                    "mt-5 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent shadow-sm rounded-md hover:opacity-80 disabled:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50",
                  handleSubmit: handleSave,
                },
              }}
            >
              <PaymentMethod>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center">
                    <div className="px-2">
                      <PaymentMethodRadioButton />
                    </div>
                    <PaymentMethodName />
                  </div>
                  <PaymentMethodPrice labelFree={t("general.free")} />
                </div>
                <PaymentSource
                  data-cy="payment-source"
                  className="p-5 my-2 bg-gray-50"
                />
              </PaymentMethod>
            </PaymentMethodsContainer>
            <PlaceOrderContainer
              options={{
                stripePayment: {
                  publishableKey: "pk_test_UArgJuzBMSppFkvAkATXTNT5",
                },
                saveShippingAddressToCustomerBook: true,
                saveBillingAddressToCustomerBook: true,
              }}
            >
              <div>
                <PlaceOrderSaveButton onClick={handlePlaceOrder} />
              </div>
            </PlaceOrderContainer>
          </>
        ) : hasPaymentMethod ? (
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
        ) : (
          <div>Metodo di pagamento da selezionare</div>
        )}
      </StepContent>
    </div>
  )
}

const PlaceOrderSaveButton = styled(PlaceOrderButton)`
  ${ButtonCss}
`
