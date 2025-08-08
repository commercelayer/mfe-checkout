import type { FC } from "react"

export const CartLinkWrapper: FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => (
  <div
    {...props}
    className="flex flex-row justify-between mt-7 pt-6 border-t"
  />
)

export const LinkWrapper: FC<React.HTMLAttributes<HTMLAnchorElement>> = (
  props,
) => <a {...props} className="text-xs font-bold border-b" />
