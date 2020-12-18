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

  return (
    <div className={className}>
      <StepHeader
        stepNumber={2}
        status={appCtx?.hasCustomer ? "add" : "disabled"}
        label="Delivery"
        info="Shipment summary and delivery methods"
      />
      <StepContent>
        {appCtx?.hasShipping ? (
          <div>You have a shipping method set</div>
        ) : appCtx?.hasCustomer ? (
          <div>
            No shipping method set
            <div>
              <button
                tw="bg-blue-600 mt-2 text-white block px-3"
                onClick={() => {
                  appCtx?.onShippingUpdated()
                }}
              >
                Add shipping
              </button>
            </div>
          </div>
        ) : (
          <div>Add customer data before shipping</div>
        )}
      </StepContent>
    </div>
  )
}
