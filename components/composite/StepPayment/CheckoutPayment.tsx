import {
  PaymentMethod,
  PaymentMethodPrice,
  PaymentSource,
} from "@commercelayer/react-components"
import { useTranslation } from "react-i18next"

import "twin.macro"
import { PaymentContainer } from "./PaymentContainer"
import { PaymentDetails } from "./PaymentDetails"
import { PaymentMethodNameWithStripe } from "./PaymentMethodNameWithStripe"
import {
  PaymentWrapper,
  PaymentSummary,
  PaymentSummaryItem,
  PaymentSummaryValue,
  PaymentRadioContainer,
  PaymentSourceContainer,
  PaymentDetailsWrapper,
  StyledPaymentMethodRadioButton,
} from "./styled"

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
      <PaymentMethod activeClass="active" className="payment">
        <PaymentWrapper>
          <PaymentSummary>
            <PaymentSummaryItem>
              <PaymentRadioContainer>
                <StyledPaymentMethodRadioButton className="form-radio" />
              </PaymentRadioContainer>
              <PaymentMethodNameWithStripe />
            </PaymentSummaryItem>
            <PaymentSummaryValue>
              <PaymentMethodPrice labelFree={t("general.free")} />
            </PaymentSummaryValue>
          </PaymentSummary>
          <PaymentSourceContainer data-cy="payment-source">
            <PaymentSource className="flex flex-row py-2 my-2">
              <PaymentDetailsWrapper>
                <PaymentDetails hasEditButton />
              </PaymentDetailsWrapper>
            </PaymentSource>
          </PaymentSourceContainer>
        </PaymentWrapper>
      </PaymentMethod>
    </PaymentContainer>
  )
}
