import type { FC } from "react"

export const Text: FC<React.HTMLAttributes<HTMLParagraphElement>> = (props) => (
  <p {...props} className="p-4 text-sm font-normal text-gray-500" />
)

export const ErrorCode: FC<React.HTMLAttributes<HTMLParagraphElement>> = (
  props,
) => (
  <p
    {...props}
    className="p-4 text-xl font-bold border-gray-300 text-gray-800 border-b md:border-r md:border-b-0"
  />
)
