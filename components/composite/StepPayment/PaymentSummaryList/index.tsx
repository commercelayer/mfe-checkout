import { PaymentMethodPrice } from "@commercelayer/react-components"
import { useTranslation } from "react-i18next"

import "twin.macro"

import { PaymentMethodNameWithStripe } from "../PaymentMethodNameWithStripe"
import {
  PaymentSummary,
  PaymentSummaryItem,
  PaymentSummaryValue,
  PaymentRadioContainer,
  StyledPaymentMethodRadioButton,
} from "../styled"

import { StyledErrors } from "components/composite/OrderSummary/CouponOrGiftCard/styled"

export const PaymentSummaryList = () => {
  const { t } = useTranslation()
  return (
    <>
      <PaymentSummary>
        <PaymentSummaryItem data-cy="payment-method-item">
          <PaymentRadioContainer>
            <StyledPaymentMethodRadioButton className="form-radio" />
          </PaymentRadioContainer>
          <PaymentMethodNameWithStripe />
        </PaymentSummaryItem>
        <PaymentSummaryValue>
          <PaymentMethodPrice labelFree={t("general.free")} />
        </PaymentSummaryValue>
      </PaymentSummary>
      <StyledErrors resource="payment_methods" />
    </>
  )
}
