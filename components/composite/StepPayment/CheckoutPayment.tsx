import { PaymentMethod, PaymentSource } from "@commercelayer/react-components"

import "twin.macro"

import { PaymentDetails } from "./PaymentDetails"
import { PaymentSkeleton } from "./PaymentSkeleton"
import { PaymentSummaryList } from "./PaymentSummaryList"
import {
  PaymentWrapper,
  PaymentSourceContainer,
  PaymentDetailsWrapper,
} from "./styled"

interface Props {
  refetchOrder: () => Promise<void>
}

export const CheckoutPayment: React.FC<Props> = ({ refetchOrder }) => {
  return (
    <>
      <PaymentMethod
        activeClass="active"
        className="payment"
        loader={PaymentSkeleton}
        clickableContainer
        onClick={refetchOrder}
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
    </>
  )
}
