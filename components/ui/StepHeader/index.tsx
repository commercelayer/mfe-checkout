import { Badge } from "../Badge"

interface Props {
  status: "edit" | "done" | "disabled" | "skip"
  label: string
  info: string | Element | JSX.Element
  stepNumber?: number
  onEditRequest?: () => void
}

export const StepHeader: React.FC<Props> = ({
  status,
  label,
  info,
  stepNumber,
}) => {
  return (
    <div className="flex items-start mb-1.5 md:pl-0 md:mb-5">
      <div>
        <div className="flex items-center mb-0.5">
          <Badge status={status} stepNumber={stepNumber} />
          <h2
            className="text-lg font-semibold leading-none pl-2"
            data-testid="step-header-customer"
          >
            {label}
          </h2>
        </div>
        <div
          className="text-gray-400 text-sm pl-8"
          data-testid="step-header-info"
        >
          <>{info}</>
        </div>
      </div>
    </div>
  )
}
