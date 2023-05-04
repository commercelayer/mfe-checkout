import { PaymentMethodPrice } from "@commercelayer/react-components"
import { useTranslation } from "react-i18next"

import { PaymentMethodNameWithStripe } from "../PaymentMethodNameWithStripe"
import {
  PaymentSummary,
  PaymentSummaryItem,
  PaymentSummaryValue,
  PaymentRadioContainer,
  StyledPaymentMethodRadioButton,
} from "../styled"

import { StyledErrors } from "components/composite/OrderSummary/CouponOrGiftCard/styled"

export const PaymentSummaryList = ({ hasTitle }: { hasTitle: boolean }) => {
  const { t } = useTranslation()
  return (
    <>
      <PaymentSummary>
        <PaymentSummaryItem data-testid="payment-method-item">
          <PaymentRadioContainer>
            <StyledPaymentMethodRadioButton className="form-radio" />
          </PaymentRadioContainer>
          {hasTitle && <PaymentMethodNameWithStripe />}
        </PaymentSummaryItem>
        {hasTitle && (
          <PaymentSummaryValue>
            <PaymentMethodPrice labelFree="&nbsp;" />
          </PaymentSummaryValue>
        )}
      </PaymentSummary>
      <StyledErrors resource="payment_methods" />
    </>
  )
}
