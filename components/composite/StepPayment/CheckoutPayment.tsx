import { PaymentMethod, PaymentSource } from "@commercelayer/react-components"

import { PaymentDetails } from "./PaymentDetails"
import { PaymentSkeleton } from "./PaymentSkeleton"
import { PaymentSummaryList } from "./PaymentSummaryList"
import {
  PaymentWrapper,
  PaymentSourceContainer,
  PaymentDetailsWrapper,
} from "./styled"

interface Props {
  selectPayment: () => Promise<void>
}

export const CheckoutPayment: React.FC<Props> = ({ selectPayment }) => {
  return (
    <>
      <PaymentMethod
        activeClass="active"
        className="payment group"
        loader={PaymentSkeleton}
        clickableContainer
        onClick={selectPayment}
      >
        <PaymentWrapper data-test-id="payment-sources-container">
          <PaymentSummaryList />
          <PaymentSourceContainer data-test-id="payment-source">
            <PaymentSource className="flex flex-col" loader={PaymentSkeleton}>
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
