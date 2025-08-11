import classNames from "classnames"
import type { FC, HTMLAttributes } from "react"

interface StepProps extends HTMLAttributes<HTMLLIElement> {
  $isActive?: boolean
  $isLocked?: boolean
}

export const Step: FC<StepProps> = ({
  $isActive,
  $isLocked,
  className,
  ...props
}) => {
  return (
    <li
      {...props}
      className={classNames(
        "relative flex items-center",
        {
          "font-bold text-black": $isActive,
          "text-gray-400/50 pointer-events-none": $isLocked && !$isActive,
          "cursor-pointer": !($isLocked && !$isActive),
        },
        className,
      )}
    />
  )
}
