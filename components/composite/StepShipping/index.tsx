import { useContext } from "react"

import "twin.macro"
import { AppContext } from "components/data/AppProvider"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"

interface Props {
  className?: string
}

export const StepShipping: React.FC<Props> = ({ className }) => {
  const appCtx = useContext(AppContext)
  if (!appCtx || !appCtx.hasShippingAddress) {
    return null
  }

  const { hasShippingMethod } = appCtx

  return (
    <div className={className}>
      <StepHeader
        stepNumber={2}
        status={hasShippingMethod ? "done" : "add"}
        label="Delivery"
        info="Shipment summary and delivery methods"
      />
      <StepContent>
        {hasShippingMethod ? (
          <div>You have a shipping method set</div>
        ) : (
          <div>Add customer data before shipping</div>
        )}
      </StepContent>
    </div>
  )
}
