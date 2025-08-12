import classNames from "classnames"
import type { FC, ReactNode } from "react"

interface Props {
  className?: string
  rounded?: boolean
  fullHeight?: boolean
  children?: ReactNode
}

export const Card: FC<Props> = ({
  children,
  className,
  rounded,
  fullHeight,
}) => (
  <div
    className={classNames(
      "p-5 md:px-8 lg:px-12 lg:pt-10 xl:px-24 xl:pt-12 bg-white shadow-xs",
      {
        "rounded-md": rounded,
        "min-h-full": fullHeight,
      },
      className,
    )}
  >
    {children}
  </div>
)
