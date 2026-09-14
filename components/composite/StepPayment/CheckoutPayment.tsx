import { PaymentMethod, PaymentSource } from "@commercelayer/react-components"
import type { JSX } from "react"
import type { PaymentMethodConfig } from "./PaymentContainer"
import { PaymentDetails } from "./PaymentDetails"
import { PaymentSkeleton } from "./PaymentSkeleton"
import { PaymentSummaryList } from "./PaymentSummaryList"
import {
  PaymentDetailsWrapper,
  PaymentSourceContainer,
  PaymentWrapper,
} from "./styled"

interface Props {
  /** Gateway configuration that used to live on the deprecated container. */
  paymentConfig: PaymentMethodConfig
  selectPayment: Parameters<typeof PaymentMethod>[0]["onClick"]
  hasTitle: boolean
  autoSelectCallback: () => void
  isPaymentLoading: boolean
}

export const CheckoutPayment = ({
  paymentConfig,
  selectPayment,
  hasTitle,
  autoSelectCallback,
  isPaymentLoading,
}: Props): JSX.Element => {
  return (
    <PaymentMethod
      config={paymentConfig}
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
