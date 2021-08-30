import { PaymentMethod, PaymentSource } from "@commercelayer/react-components"
import {
  CustomerCardsProps,
  CustomerSaveToWalletProps,
} from "@commercelayer/react-components/dist/components/PaymentSource"
import { useTranslation } from "react-i18next"

import "twin.macro"

import { Label } from "components/ui/Label"

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
  refetchOrder: () => Promise<void>
}

export const CheckoutCustomerPayment: React.FC<Props> = ({ refetchOrder }) => {
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
    <div className="flex items-center mt-4">
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
    <>
      <PaymentMethod
        activeClass="active"
        className="payment"
        loader={PaymentSkeleton}
        clickableContainer
        onClick={refetchOrder}
      >
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
              loader={PaymentSkeleton}
            >
              <PaymentDetailsWrapper>
                <PaymentDetails hasEditButton />
              </PaymentDetailsWrapper>
            </PaymentSource>
          </PaymentSourceContainer>
        </PaymentWrapper>
      </PaymentMethod>
    </>
  )
}
