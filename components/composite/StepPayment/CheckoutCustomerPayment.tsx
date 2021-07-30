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
import StepPlaceOrder from "../StepPlaceOrder"

import { Label } from "components/ui/Label"

import { PaymentContainer } from "./PaymentContainer"
import { PaymentDetails } from "./PaymentDetails"
import { PaymentSkeleton } from "./PaymentSkeleton"
import { PaymentSummaryList } from "./PaymentSummaryList"
import {
  PaymentWrapper,
  PaymentSourceContainer,
  PaymentDetailsWrapper,
  WalletCheckbox,
} from "./styled"

interface Props {
  termsUrl: string
  privacyUrl: string
  handleSave: () => void
}

export const CheckoutCustomerPayment: React.FC<Props> = ({
  termsUrl,
  privacyUrl,
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
      <PaymentContainer>
        <PaymentMethod
          activeClass="active"
          className="payment"
          loader={PaymentSkeleton}
          clickableContainer
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
                loader={PaymentSkeleton}
              >
                <PaymentDetailsWrapper>
                  <PaymentDetails hasEditButton />
                </PaymentDetailsWrapper>
              </PaymentSource>
            </PaymentSourceContainer>
          </PaymentWrapper>
        </PaymentMethod>
        <StepPlaceOrder termsUrl={termsUrl} privacyUrl={privacyUrl} />
      </PaymentContainer>
    </CustomerContainer>
  )
}
