import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"

interface Props {
  className?: string
}

export const StepCustomer: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <StepHeader
        stepNumber={1}
        status="done"
        label="Customer"
        info="Billing information and shipping address"
      />
      <StepContent>
        <div>&lt;BillingAddressContainer&gt;</div>
        <div>&lt;NextStepContainer&gt;</div>
      </StepContent>
    </div>
  )
}
