import {
  PaymentMethod,
  PaymentMethodName,
  PaymentMethodPrice,
  PaymentMethodRadioButton,
  PaymentSource,
} from "@commercelayer/react-components"
import { useTranslation } from "react-i18next"

import "twin.macro"
import { PaymentContainer } from "./PaymentContainer"
import { PaymentDetails } from "./PaymentDetails"
import { PaymentWrapper } from "./styled"

interface Props {
  stripeKey: string
  handleSave: () => void
}

export const CheckoutPayment: React.FC<Props> = ({
  stripeKey,
  handleSave,
}: Props) => {
  const { t } = useTranslation()

  return (
    <PaymentContainer handleSave={handleSave} stripeKey={stripeKey}>
      <PaymentMethod>
        <PaymentWrapper>
          <div className="flex items-center">
            <div className="px-2">
              <PaymentMethodRadioButton />
            </div>
            <PaymentMethodName />
          </div>
          <PaymentMethodPrice labelFree={t("general.free")} />
        </PaymentWrapper>
        <div data-cy="payment-source">
          <PaymentSource className="flex flex-row py-2 my-2">
            <div className="flex flex-row items-center justify-start p-3 text-sm bg-gray-100 border">
              <PaymentDetails hasEditButton />
            </div>
          </PaymentSource>
        </div>
      </PaymentMethod>
    </PaymentContainer>
  )
}
