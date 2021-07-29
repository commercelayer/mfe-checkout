import { PaymentMethod, PaymentSource } from "@commercelayer/react-components"

import "twin.macro"
import StepPlaceOrder from "../StepPlaceOrder"

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
  termsUrl: string
  privacyUrl: string
}

export const CheckoutPayment: React.FC<Props> = ({ privacyUrl, termsUrl }) => {
  return (
    <PaymentContainer>
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
      <StepPlaceOrder termsUrl={termsUrl} privacyUrl={privacyUrl} />
    </PaymentContainer>
  )
}
