import { PaymentMethod, PaymentSource } from "@commercelayer/react-components"

import "twin.macro"
import { PaymentContainer } from "./PaymentContainer"
import { PaymentDetails } from "./PaymentDetails"
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
      <PaymentMethod activeClass="active" className="payment">
        <PaymentWrapper>
          <PaymentSummaryList />
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
