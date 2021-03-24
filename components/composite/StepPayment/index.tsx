import { useContext } from "react"
import {
  PaymentMethod,
  PaymentMethodName,
  PaymentMethodPrice,
  PaymentMethodRadioButton,
  PaymentMethodsContainer,
  PaymentSource,
  PaymentSourceBrandIcon,
  PaymentSourceBrandName,
  PaymentSourceDetail,
  PaymentSourceEditButton,
  PlaceOrderButton,
  PlaceOrderContainer,
} from "@commercelayer/react-components"
import { Trans, useTranslation } from "react-i18next"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWallet } from "@fortawesome/free-solid-svg-icons"
import "twin.macro"

import { AppContext } from "components/data/AppProvider"
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
                >
                  <div className="flex flex-row items-center justify-start bg-gray-100 p-5 my-2">
                    <div className="flex flex-row items-center">
                      <PaymentSourceBrandIcon className="mr-3" />
                      <Trans t={t} i18nKey="stepPayment.endingIn">
                        <PaymentSourceBrandName className="mr-1" />
                        <PaymentSourceDetail className="ml-1" type="last4" />
                      </Trans>
                    </div>
                    <div className="text-gray-500 ml-5">
                      <PaymentSourceDetail type="expMonth" />/
                      <PaymentSourceDetail type="expYear" />
                    </div>
                    <div className="ml-5">
                      <PaymentSourceEditButton
                        label={t("general.edit")}
                        className="text-primary hover:underline hover:opacity-80 font-bold"
                      />
                    </div>
                  </div>
                </PaymentSource>
              </PaymentMethod>
            </PaymentMethodsContainer>
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
            <PaymentMethodsContainer>
              <PaymentSource readonly>
                <div className="flex flex-row items-center bg-gray-100 p-5 my-5">
                  <div className="flex flex-row items-center w-1/2">
                    <PaymentSourceBrandIcon className="mr-3" />
                    <Trans t={t} i18nKey="stepPayment.endingIn">
                      <PaymentSourceBrandName className="mr-1" />
                      <PaymentSourceDetail className="ml-1" type="last4" />
                    </Trans>
                  </div>
                  <div className="text-gray-500">
                    <PaymentSourceDetail type="expMonth" />/
                    <PaymentSourceDetail type="expYear" />
                  </div>
                </div>
              </PaymentSource>
            </PaymentMethodsContainer>
            <PlaceOrderContainer
              options={{
                stripePayment: {
                  publishableKey: stripeKey,
                },
                saveShippingAddressToCustomerBook: true,
                saveBillingAddressToCustomerBook: true,
              }}
            >
              <div>
                <PlaceOrderSaveButton
                  data-cy="place-order-button"
                  onClick={handlePlaceOrder}
                  label={t("stepPayment.submit")}
                />
              </div>
            </PlaceOrderContainer>
          </>
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
