import { ShippingMethodRadioButton } from "@commercelayer/react-components"
import { RadioCss } from "components/ui/form/RadioButton"
import type { FC, HTMLAttributes } from "react"

export const ShippingWrapper: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div {...props} className={`shipping-wrapper ${props.className || ""}`} />
)

export const ShippingTitle: FC<HTMLAttributes<HTMLHeadingElement>> = (
  props,
) => (
  <h4
    {...props}
    className={`font-bold text-md mb-2 ${props.className || ""}`}
  />
)

export const ShippingSummary: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div {...props} className={`contents ${props.className || ""}`} />
)

export const ShippingSummaryItem: FC<HTMLAttributes<HTMLDivElement>> = (
  props,
) => (
  <div
    {...props}
    className={`flex flex-1 font-bold ml-2 flex-col md:flex-row ${props.className || ""}`}
  />
)

export const ShippingSummaryItemDescription: FC<
  HTMLAttributes<HTMLParagraphElement>
> = (props) => (
  <p
    {...props}
    className={`text-gray-500 font-normal text-ss ${props.className || ""}`}
  />
)

export const ShippingSummaryValue: FC<HTMLAttributes<HTMLParagraphElement>> = (
  props,
) => (
  <p
    {...props}
    className={`text-black font-bold uppercase text-sm pt-2 ${props.className || ""}`}
  />
)

export const ShippingLineItem: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div {...props} className={`flex mt-4 ${props.className || ""}`} />
)

export const ShippingLineItemDescription: FC<HTMLAttributes<HTMLDivElement>> = (
  props,
) => (
  <div {...props} className={`flex flex-col ml-3 ${props.className || ""}`} />
)

export const ShippingLineItemTitle: FC<HTMLAttributes<HTMLHeadingElement>> = (
  props,
) => (
  <h5
    {...props}
    className={`text-black text-sm font-bold ${props.className || ""}`}
  />
)

export const ShippingLineItemQty: FC<HTMLAttributes<HTMLParagraphElement>> = (
  props,
) => (
  <p
    {...props}
    className={`text-xs font-semibold text-gray-400 lowercase pt-1 first-letter:uppercase ${props.className || ""}`}
  />
)

export const StyledShippingMethodRadioButton: FC<
  React.ComponentProps<typeof ShippingMethodRadioButton>
> = (props) => (
  <ShippingMethodRadioButton
    {...props}
    className={`${RadioCss} hidden ${props.className || ""}`}
  />
)
