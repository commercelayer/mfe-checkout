import type { FC, HTMLAttributes } from "react"

export const Icon: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div {...props} className={`w-7 text-gray-500 ${props.className || ""}`} />
)
