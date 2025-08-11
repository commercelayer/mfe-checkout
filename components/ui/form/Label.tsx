import type { FC, LabelHTMLAttributes } from "react"

export const Label: FC<LabelHTMLAttributes<HTMLLabelElement>> = (props) => (
  // biome-ignore lint/a11y/noLabelWithoutControl: Component is used with an input
  <label
    {...props}
    className={`absolute top-0 left-2 transition-all -translate-y-1/2 bg-white px-1 text-xs text-gray-500 focus:text-gray-900 ${props.className || ""}`}
  />
)
