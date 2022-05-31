import {
  CustomerCardsType,
  PaymentMethod,
  PaymentSource,
} from "@commercelayer/react-components"
import { CustomerSaveToWalletProps } from "@commercelayer/react-components/lib/components/PaymentSource"
import { MouseEvent, useState } from "react"
import { useTranslation } from "react-i18next"

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
  selectPayment: () => Promise<void>
}

export const CheckoutCustomerPayment: React.FC<Props> = ({ selectPayment }) => {
  const { t } = useTranslation()

  // TemplateSaveToWalletCheckbox
  const [checked, setChecked] = useState(false)

  const TemplateCustomerCards = ({
    customerPayments,
    PaymentSourceProvider,
  }: CustomerCardsType) => {
    return (
      <>
        {customerPayments?.map((p, k) => {
          return (
            <div
              key={k}
              data-test-id="customer-card"
              onClick={p.handleClick}
              className="flex flex-col items-start p-3 mb-4 text-sm border rounded cursor-pointer lg:flex-row lg:items-center shadow-sm hover:border-primary"
            >
              <PaymentSourceProvider value={{ ...p.card }}>
                <PaymentDetails />
              </PaymentSourceProvider>
            </div>
          )
        })}
      </>
    )
  }

  const TemplateSaveToWalletCheckbox = ({
    name,
  }: CustomerSaveToWalletProps) => {
    const handleClick = (
      e: MouseEvent<HTMLInputElement, globalThis.MouseEvent>
    ) => e?.stopPropagation()
    const handleChange = () => {
      setChecked(!checked)
    }

    return (
      <div className="flex items-center mt-4">
        <WalletCheckbox
          name={name}
          id={name}
          data-test-id="save-to-wallet"
          type="checkbox"
          className="form-checkbox"
          checked={checked}
          onClick={handleClick}
          onChange={handleChange}
        />
        <Label
          htmlFor={name}
          dataTestId="payment-save-wallet"
          textLabel={t("stepPayment.saveToWallet")}
        />
      </div>
    )
  }

  return (
    <>
      <PaymentMethod
        activeClass="active group"
        className="payment"
        loader={PaymentSkeleton}
        clickableContainer
        onClick={selectPayment}
      >
        <PaymentWrapper>
          <PaymentSummaryList />
          <PaymentSourceContainer data-test-id="payment-source">
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
