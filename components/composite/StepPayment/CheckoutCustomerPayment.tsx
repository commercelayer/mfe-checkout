import {
  PaymentMethod,
  PaymentSource,
  CustomerContainer,
} from "@commercelayer/react-components"
import {
  CustomerCardsProps,
  CustomerSaveToWalletProps,
} from "@commercelayer/react-components/dist/components/PaymentSource"
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
        <PaymentMethod
          activeClass="active"
          className="payment"
          loader={
            <div className="animate-pulse">
              <div className="my-5 bg-gray-200 h-7" />
              <div className="my-5 bg-gray-200 h-7" />
            </div>
          }
        >
          <PaymentWrapper>
            <PaymentSummaryList />
            <PaymentSourceContainer data-cy="payment-source">
              <PaymentSource
                className="flex flex-col"
                onClickCustomerCards={handleSave}
                templateCustomerCards={(props) => (
                  <TemplateCustomerCards {...props} />
                )}
                templateCustomerSaveToWallet={(props) => (
                  <TemplateSaveToWalletCheckbox {...props} />
                )}
                loader={
                  <div className="animate-pulse">
                    <div className="my-5 bg-gray-200 h-7" />
                    <div className="my-5 bg-gray-200 h-7" />
                  </div>
                }
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
