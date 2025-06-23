import PaymentMethod, {
  type PaymentMethodOnClickParams,
} from "@commercelayer/react-components/payment_methods/PaymentMethod"
import PaymentSource, {
  type CustomerSaveToWalletProps,
} from "@commercelayer/react-components/payment_source/PaymentSource"
import { Label } from "components/ui/Label"
import { type MouseEvent, useState } from "react"
import { useTranslation } from "react-i18next"

import { PaymentDetails } from "./PaymentDetails"
import { PaymentSkeleton } from "./PaymentSkeleton"
import { PaymentSummaryList } from "./PaymentSummaryList"
import {
  PaymentDetailsWrapper,
  PaymentSourceContainer,
  PaymentWrapper,
  WalletCheckbox,
} from "./styled"

interface Props {
  selectPayment: (params: PaymentMethodOnClickParams) => void
  hasTitle: boolean
  autoSelectCallback: () => void
  hasSubscriptions: boolean
  isPaymentLoading: boolean
}

type TTemplateCustomerCards = Parameters<
  typeof PaymentSource
>[0]["templateCustomerCards"]

const TemplateCustomerCards: TTemplateCustomerCards = ({
  customerPayments,
  PaymentSourceProvider,
}) => {
  const { t } = useTranslation()

  return (
    <>
      {customerPayments?.map((p, k) => {
        return (
          <button
            key={k}
            type="button"
            data-testid="customer-card"
            onClick={p.handleClick}
            className="flex flex-col items-start p-3 mb-4 text-sm border rounded cursor-pointer lg:flex-row lg:items-center shadow-sm hover:border-gray-400"
            tabIndex={0}
            aria-label={t("stepPayment.selectCard")}
          >
            <PaymentSourceProvider value={{ ...p.card }}>
              <PaymentDetails />
            </PaymentSourceProvider>
          </button>
        )
      })}
    </>
  )
}

const TemplateSaveToWalletCheckbox = ({ name }: CustomerSaveToWalletProps) => {
  const [checked, setChecked] = useState(false)
  const { t } = useTranslation()

  const handleClick = (
    e: MouseEvent<HTMLInputElement, globalThis.MouseEvent>,
  ) => e?.stopPropagation()
  const handleChange = () => {
    setChecked(!checked)
  }

  return (
    <div className="flex items-center mt-4">
      <WalletCheckbox
        name={name}
        id={name}
        data-testid="save-to-wallet"
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

export const CheckoutCustomerPayment: React.FC<Props> = ({
  selectPayment,
  hasTitle,
  autoSelectCallback,
  hasSubscriptions,
  isPaymentLoading,
}) => {
  return (
    <>
      <PaymentMethod
        autoSelectSinglePaymentMethod={autoSelectCallback}
        showLoader={isPaymentLoading}
        activeClass="active group"
        className="payment"
        loader={<PaymentSkeleton />}
        clickableContainer
        onClick={selectPayment}
      >
        <PaymentWrapper>
          <PaymentSummaryList hasTitle={hasTitle} />
          <PaymentSourceContainer data-testid="payment-source">
            <PaymentSource
              className="flex flex-col"
              templateCustomerCards={(props) => (
                <TemplateCustomerCards {...props} />
              )}
              templateCustomerSaveToWallet={(props) =>
                hasSubscriptions ? (
                  <></> // No save to wallet checkbox for subscriptions
                ) : (
                  <TemplateSaveToWalletCheckbox {...props} />
                )
              }
              loader={<PaymentSkeleton />}
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
