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

interface Props {
  handleSave: () => void
}

export const CheckoutPayment: React.FC<Props> = ({ handleSave }: Props) => {
  return (
    <PaymentContainer handleSave={handleSave}>
      <PaymentMethod
        activeClass="active"
        className="payment"
        loader={PaymentSkeleton}
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
