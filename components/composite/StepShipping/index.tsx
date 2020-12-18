import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"

interface Props {
  className?: string
}

export const StepShipping: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <StepHeader
        stepNumber={2}
        status="edit"
        label="Delivery"
        info="Shipment summary and delivery methods"
      />
      <StepContent>
        <div>&lt;ShippingAddressContainer&gt;</div>
        <div>&lt;NextStepContainer&gt;</div>
      </StepContent>
    </div>
  )
}
