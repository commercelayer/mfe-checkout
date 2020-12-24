import { useContext } from "react"

import "twin.macro"
import { AppContext } from "components/data/AppProvider"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"

interface Props {
  className?: string
}

export const StepCustomer: React.FC<Props> = ({ className }) => {
  const appCtx = useContext(AppContext)

  if (!appCtx) {
    return null
  }
  const { hasShippingAddress, hasBillingAddress } = appCtx

  return (
    <div className={className}>
      <StepHeader
        stepNumber={1}
        status={hasShippingAddress ? "done" : "add"}
        label="Customer"
        info="Billing information and shipping address"
      />
      <StepContent>
        {hasShippingAddress && hasBillingAddress ? (
          <div>Hello, you have both shipping and billing address set</div>
        ) : hasShippingAddress ? (
          <div>Hello, you have only shipping address set</div>
        ) : hasBillingAddress ? (
          <div>Hello, you have only billing address set</div>
        ) : (
          <div>No Billing / Shipping Address set</div>
        )}
      </StepContent>
    </div>
  )
}
