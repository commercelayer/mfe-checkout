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

  return (
    <div className={className}>
      <StepHeader
        stepNumber={1}
        status={appCtx && appCtx.hasCustomer ? "done" : "add"}
        label="Customer"
        info="Billing information and shipping address"
        onAddRequest={() => {
          appCtx?.onCustomerUpdated()
        }}
      />
      <StepContent>
        {appCtx?.hasCustomer ? (
          <div>Hello customer</div>
        ) : (
          <div>No customer set</div>
        )}
      </StepContent>
    </div>
  )
}
