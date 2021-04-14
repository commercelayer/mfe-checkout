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
import { PaymentContainer } from "./PaymentContainer"
import { PaymentDetails } from "./PaymentDetails"

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
    <div className="flex flex-row-reverse justify-end">
      <label
        htmlFor="billing_address_save_to_customer_book"
        className="self-end block ml-3 text-sm font-medium text-primary"
        data-cy="payment-save-wallet"
      >
        {t("stepPayment.saveToWallet")}
      </label>
      <div className="mt-1">
        <input
          name={name}
          data-cy="save-to-wallet"
          type="checkbox"
          className="w-4 h-4 border-gray-300 rounded text-primary focus:ring-primary"
        />
      </div>
    </div>
  )

  return (
    <CustomerContainer>
      <PaymentContainer handleSave={handleSave} stripeKey={stripeKey}>
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
          <div data-cy="payment-source">
            <PaymentSource
              className="flex flex-row py-2 my-2"
              templateCustomerCards={(props) => (
                <TemplateCustomerCards {...props} />
              )}
              templateCustomerSaveToWallet={(props) => (
                <TemplateSaveToWalletCheckbox {...props} />
              )}
            >
              <div className="flex flex-row items-center justify-start p-3 text-sm bg-gray-100 border">
                <PaymentDetails hasEditButton />
              </div>
            </PaymentSource>
          </div>
        </PaymentMethod>
      </PaymentContainer>
    </CustomerContainer>
  )
}
