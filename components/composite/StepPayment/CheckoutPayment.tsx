import { PaymentMethod, PaymentSource } from "@commercelayer/react-components"

import "twin.macro"

import { PaymentContainer } from "./PaymentContainer"
import { PaymentDetails } from "./PaymentDetails"
import { PaymentSkeleton } from "./PaymentSkeleton"
import { PaymentSummaryList } from "./PaymentSummaryList"
import {
  PaymentWrapper,
  PaymentSourceContainer,
  PaymentDetailsWrapper,
} from "./styled"

export const CheckoutPayment: React.FC = () => {
  return (
    <PaymentContainer>
      <PaymentMethod
        activeClass="active"
        className="payment"
        loader={PaymentSkeleton}
        clickableContainer
      >
        <PaymentWrapper>
          <PaymentSummaryList />
          <PaymentSourceContainer data-cy="payment-source">
            <PaymentSource className="flex flex-col" loader={PaymentSkeleton}>
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
