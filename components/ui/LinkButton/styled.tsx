import type { FC } from "react"
import type LinkButtonProps from "./props"

export const Button: FC<
  LinkButtonProps & React.AnchorHTMLAttributes<HTMLAnchorElement>
> = ({ className, ...props }) => (
  <a
    {...props}
    className={`block w-full py-2 text-center mb-4 bg-gray-200 rounded-sm text-ss font-bold cursor-pointer text-gray-700 md:text-primary md:inline md:w-auto md:border-b md:border-gray-200 md:p-0 md:bg-transparent md:m-0 ${className || ""}`}
  />
)
