import { useContext } from "react"
import {
  PaymentMethod,
  PaymentMethodName,
  PaymentMethodPrice,
  PaymentMethodRadioButton,
  PaymentMethodsContainer,
  PaymentSource,
} from "@commercelayer/react-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWallet } from "@fortawesome/free-solid-svg-icons"
import "twin.macro"

import { AppContext } from "components/data/AppProvider"
import { useTranslation } from "components/data/i18n"
import { Button } from "components/ui/Button"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"
import { Icon } from "components/ui/Icon"

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
  const { t } = useTranslation()

  if (!appCtx || !appCtx.hasShippingMethod) {
    return null
  }

  const { hasPaymentMethod, paymentMethod, refetchOrder } = appCtx

  return (
    <div className={className}>
      <StepHeader
        stepNumber={2}
        status={isActive ? "edit" : "done"}
        label={t("stepPayment.title")}
        info={
          isActive
            ? t("stepPayment.summary")
            : "Metodo di pagamento selezionato"
        }
        onEditRequest={() => {
          onToggleActive()
        }}
      />
      <StepContent>
        {isActive ? (
          <PaymentMethodsContainer
            config={{
              stripePayment: {
                publishableKey: "pk_test_UArgJuzBMSppFkvAkATXTNT5",
                submitLabel: t("stepPayment.setPaymentMethod"),
                submitClassName:
                  "mt-5 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent shadow-sm rounded-md hover:opacity-80 disabled:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50",
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
              <PaymentSource className="p-5 my-2 bg-gray-50" />
            </PaymentMethod>
          </PaymentMethodsContainer>
        ) : hasPaymentMethod ? (
          <div className="grid grid-cols-3 gap-2">
            <div className="flex">
              <Icon>
                <FontAwesomeIcon icon={faWallet} />
              </Icon>
              <p className="font-bold">{paymentMethod?.name}</p>
            </div>
            <p>{paymentMethod?.formattedPriceAmount}</p>
          </div>
        ) : (
          <div>Metodo di pagamento da selezionare</div>
        )}
      </StepContent>
    </div>
  )
}
