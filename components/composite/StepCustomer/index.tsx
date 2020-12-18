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
      />
      <StepContent>
        {appCtx?.hasCustomer ? (
          <div>Hello customer</div>
        ) : (
          <div>
            No customer set
            <div>
              <button
                tw="bg-blue-600 mt-2 text-white block px-3"
                onClick={() => {
                  appCtx?.onCustomerUpdated()
                }}
              >
                Add customer data
              </button>
            </div>
          </div>
        )}
      </StepContent>
    </div>
  )
}
