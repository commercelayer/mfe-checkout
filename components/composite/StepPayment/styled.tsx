import { PaymentMethodRadioButton } from "@commercelayer/react-components"
import { CheckCss } from "components/ui/form/CheckBox"
import { RadioCss } from "components/ui/form/RadioButton"
import type { FC, HTMLAttributes, InputHTMLAttributes } from "react"

export const PaymentWrapper: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div {...props} className={`payment-wrapper ${props.className || ""}`} />
)

export const PaymentSummary: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div
    {...props}
    className={`flex flex-row justify-around text-sm items-center ${props.className || ""}`}
  />
)

export const PaymentSummaryItem: FC<HTMLAttributes<HTMLDivElement>> = (
  props,
) => (
  <div
    {...props}
    className={`flex flex-1 font-bold leading-none ${props.className || ""}`}
  />
)

export const PaymentRadioContainer: FC<HTMLAttributes<HTMLDivElement>> = (
  props,
) => <div {...props} className={`hidden ${props.className || ""}`} />

export const PaymentSummaryValue: FC<HTMLAttributes<HTMLParagraphElement>> = (
  props,
) => (
  <p
    {...props}
    className={`flex font-bold uppercase text-ss leading-8 ${props.className || ""}`}
  />
)

export const PaymentSourceContainer: FC<HTMLAttributes<HTMLDivElement>> = (
  props,
) => (
  <div
    {...props}
    className={`payment-source-container ${props.className || ""}`}
  />
)
export const PaymentDetailsWrapper: FC<HTMLAttributes<HTMLDivElement>> = (
  props,
) => (
  <div
    {...props}
    className={`flex flex-row items-start justify-between lg:justify-start lg:items-center text-sm ${props.className || ""}`}
  />
)

export const PaymentItemTitle: FC<HTMLAttributes<HTMLHeadingElement>> = (
  props,
) => <h5 {...props} className={`text-sm font-bold ${props.className || ""}`} />

export const ShippingLineItemQty: FC<HTMLAttributes<HTMLParagraphElement>> = (
  props,
) => (
  <p
    {...props}
    className={`text-lg text-gray-500 lowercase pt-1 ${props.className || ""}`}
  />
)

interface WalletCheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  name: string
}

export const WalletCheckbox: FC<WalletCheckboxProps> = (props) => (
  <input
    type="checkbox"
    {...props}
    className={`${CheckCss} ${props.className || ""}`}
  />
)

export const StyledPaymentMethodRadioButton: FC<any> = (props) => (
  <PaymentMethodRadioButton
    {...props}
    className={`${RadioCss} ${props.className || ""}`}
  />
)
