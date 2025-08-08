import type { FC } from "react"

export const Message: FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
  <div
    {...props}
    className="my-8 text-gray-400 [&>br]:hidden [&>br]:md:block [&+div]:mt-0"
  />
)
