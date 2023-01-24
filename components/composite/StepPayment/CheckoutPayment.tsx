import { PaymentMethod, PaymentSource } from "@commercelayer/react-components"

import { PaymentDetails } from "./PaymentDetails"
import { PaymentSkeleton } from "./PaymentSkeleton"
import { PaymentSummaryList } from "./PaymentSummaryList"
import {
  PaymentWrapper,
  PaymentSourceContainer,
  PaymentDetailsWrapper,
} from "./styled"

import { THandleClick } from "."

interface Props {
  selectPayment: THandleClick
  hasTitle: boolean
  autoSelectCallback: () => void
}

export const CheckoutPayment = ({
  selectPayment,
  hasTitle,
  autoSelectCallback,
}: Props): JSX.Element => {
  return (
    <PaymentMethod
      autoSelectSinglePaymentMethod={autoSelectCallback}
      activeClass="active"
      className="payment group"
      loader={<PaymentSkeleton />}
      clickableContainer
      // @ts-expect-error Type Types of parameters 'params' and 'payment' are incompatible.
      onClick={selectPayment}
    >
      <PaymentWrapper data-test-id="payment-sources-container">
        <PaymentSummaryList hasTitle={hasTitle} />
        <PaymentSourceContainer data-test-id="payment-source">
          <PaymentSource className="flex flex-col" loader={<PaymentSkeleton />}>
            <PaymentDetailsWrapper>
              <PaymentDetails hasEditButton />
            </PaymentDetailsWrapper>
          </PaymentSource>
        </PaymentSourceContainer>
      </PaymentWrapper>
    </PaymentMethod>
  )
}
