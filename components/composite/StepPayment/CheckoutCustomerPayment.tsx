import {
  PaymentMethod,
  PaymentMethodName,
  PaymentMethodPrice,
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
  WalletCheckbox,
  StyledPaymentMethodRadioButton,
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
      className="flex p-3 mr-4 text-sm border rounded shadow-sm"
    >
      <PaymentDetails />
    </div>
  )

  const TemplateSaveToWalletCheckbox = ({ name }: any) => (
    <div className="flex mt-4 flex-center">
      <WalletCheckbox
        name={name}
        id={name}
        data-cy="save-to-wallet"
        type="checkbox"
        className="form-checkbox"
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
                  <StyledPaymentMethodRadioButton className="form-radio" />
                </PaymentRadioContainer>
                {String(<PaymentMethodName />) === "Stripe payment" ? (
                  t("stepPayment.creditCard")
                ) : (
                  <PaymentMethodName />
                )}
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
