import {
  PaymentMethod,
  PaymentSource,
  CustomerContainer,
} from "@commercelayer/react-components"
import { useTranslation } from "react-i18next"

import "twin.macro"
import { Label } from "components/ui/Label"

import { PaymentContainer } from "./PaymentContainer"
import { PaymentDetails } from "./PaymentDetails"
import { PaymentSummaryList } from "./PaymentSummaryList"
import {
  PaymentWrapper,
  PaymentSourceContainer,
  PaymentDetailsWrapper,
  WalletCheckbox,
} from "./styled"

interface Props {
  handleSave: () => void
}

interface CustomerCardsProps {
  handleClick: () => void
}

type CustomerSaveToWalletProps = {
  name: "save_payment_source_to_customer_wallet"
}

export const CheckoutCustomerPayment: React.FC<Props> = ({
  handleSave,
}: Props) => {
  const { t } = useTranslation()

  const TemplateCustomerCards = ({ handleClick }: CustomerCardsProps) => (
    <div
      onClick={handleClick}
      className="flex flex-col items-start p-3 mb-4 text-sm border rounded cursor-pointer lg:flex-row lg:items-center shadow-sm hover:border-primary"
    >
      <PaymentDetails />
    </div>
  )

  const TemplateSaveToWalletCheckbox = ({
    name,
  }: CustomerSaveToWalletProps) => (
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
      <PaymentContainer handleSave={handleSave}>
        <PaymentMethod activeClass="active" className="payment">
          <PaymentWrapper>
            <PaymentSummaryList />
            <PaymentSourceContainer data-cy="payment-source">
              <PaymentSource
                className="flex flex-col"
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
