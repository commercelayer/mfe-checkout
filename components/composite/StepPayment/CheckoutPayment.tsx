import { PaymentMethod, PaymentSource } from "@commercelayer/react-components"
import { PaymentDetails } from "./PaymentDetails"
import { PaymentSkeleton } from "./PaymentSkeleton"
import { PaymentSummaryList } from "./PaymentSummaryList"
import {
  PaymentDetailsWrapper,
  PaymentSourceContainer,
  PaymentWrapper,
} from "./styled"

interface Props {
  selectPayment: Parameters<typeof PaymentMethod>[0]["onClick"]
  hasTitle: boolean
  autoSelectCallback: () => void
  isPaymentLoading: boolean
}

export const CheckoutPayment = ({
  selectPayment,
  hasTitle,
  autoSelectCallback,
  isPaymentLoading,
}: Props): JSX.Element => {
  return (
    <PaymentMethod
      showLoader={isPaymentLoading}
      autoSelectSinglePaymentMethod={autoSelectCallback}
      activeClass="active"
      className="payment group"
      loader={<PaymentSkeleton />}
      clickableContainer
      hide={["external_payments"]}
      onClick={selectPayment}
    >
      <PaymentWrapper data-testid="payment-sources-container">
        <PaymentSummaryList hasTitle={hasTitle} />
        <PaymentSourceContainer data-testid="payment-source">
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
