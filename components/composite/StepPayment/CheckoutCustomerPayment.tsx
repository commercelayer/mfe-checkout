import {
  PaymentMethod,
  PaymentMethodName,
  PaymentMethodPrice,
  PaymentMethodRadioButton,
  PaymentSource,
  CustomerContainer,
} from "@commercelayer/react-components"
import { useTranslation } from "react-i18next"

import "twin.macro"
import { Label } from "components/ui/Label"

import { PaymentContainer } from "./PaymentContainer"
import { PaymentDetails } from "./PaymentDetails"
import {
  PaymentWrapper,
  PaymentSummary,
  PaymentSummaryItem,
  PaymentSummaryValue,
  PaymentRadioContainer,
  PaymentSourceContainer,
  PaymentDetailsWrapper,
} from "./styled"

interface Props {
  stripeKey: string
  handleSave: () => void
}

export const CheckoutCustomerPayment: React.FC<Props> = ({
  stripeKey,
  handleSave,
}: Props) => {
  const { t } = useTranslation()

  const TemplateCustomerCards = ({ handleClick }: any) => (
    <div
      onClick={handleClick}
      className="flex flex-row items-center justify-start w-1/2 p-3 ml-2 text-sm bg-gray-100 border cursor-pointer hover:border-blue-500"
    >
      <PaymentDetails />
    </div>
  )

  const TemplateSaveToWalletCheckbox = ({ name }: any) => (
    <div className="flex mt-4 flex-center">
      <input
        name={name}
        id={name}
        data-cy="save-to-wallet"
        type="checkbox"
        className="self-center w-4 h-4 border-gray-300 rounded text-primary focus:ring-primary"
      />
      <Label
        htmlFor={name}
        dataCy="payment-save-wallet"
        textLabel={t("stepPayment.saveToWallet")}
      />
    </div>
  )

  return (
    <CustomerContainer>
      <PaymentContainer handleSave={handleSave} stripeKey={stripeKey}>
        <PaymentMethod activeClass="active">
          <PaymentWrapper>
            <PaymentSummary>
              <PaymentSummaryItem>
                <PaymentRadioContainer>
                  <PaymentMethodRadioButton />
                </PaymentRadioContainer>
                <PaymentMethodName />
              </PaymentSummaryItem>
              <PaymentSummaryValue>
                <PaymentMethodPrice labelFree={t("general.free")} />
              </PaymentSummaryValue>
            </PaymentSummary>

            <PaymentSourceContainer data-cy="payment-source">
              <PaymentSource
                className="flex flex-row py-2 my-2"
                templateCustomerCards={(props) => (
                  <TemplateCustomerCards {...props} />
                )}
                templateCustomerSaveToWallet={(props) => (
                  <TemplateSaveToWalletCheckbox {...props} />
                )}
              >
                <PaymentDetailsWrapper>
                  <PaymentDetails hasEditButton />
                </PaymentDetailsWrapper>
              </PaymentSource>
            </PaymentSourceContainer>
          </PaymentWrapper>
        </PaymentMethod>
      </PaymentContainer>
    </CustomerContainer>
  )
}
