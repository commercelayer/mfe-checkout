import { Badge } from "../Badge"

interface Props {
  status: "edit" | "done" | "disabled"
  stepNumber?: number
}

export const StepLine: React.FC<Props> = ({ status, stepNumber }) => {
  return (
    <div className="flex-col items-center hidden md:flex md:-left-3 md:relative">
      <div>
        <Badge status={status} stepNumber={stepNumber} />
      </div>
      <div className="w-px bg-gray-200 h-full hidden md:block" />
    </div>
  )
}
