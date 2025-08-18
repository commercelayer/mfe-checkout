import type { FC } from "react"

interface Props {
  className?: string
  children?: React.ReactNode
}

export const StepContainer: FC<Props> = ({ children, className = "" }) => (
  <div
    className={`step-container flex flex-row items-stretch justify-start mb-10 pb-5 md:pb-5 ${className}`}
  >
    {children}
  </div>
)
