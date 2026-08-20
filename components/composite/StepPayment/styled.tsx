import {
  PaymentMethodRadioButton,
  PaymentSettingGiftCardAddButton,
  PaymentSettingGiftCardInput,
  PaymentSettingGiftCardRemoveButton,
  PaymentSettingGiftCardSubmitButton,
  PaymentSettingRadioButton,
} from "@commercelayer/react-components"
import { ButtonCss } from "components/ui/Button/index"
import { CheckCss } from "components/ui/form/CheckBox"
import { ErrorCss } from "components/ui/form/Error"
import { InputCss } from "components/ui/form/Input"
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

// payment_sessions model. Mirrors the payment_source styling above so both
// models look the same to the shopper.
export const StyledPaymentSettingRadioButton: FC<any> = (props) => (
  <PaymentSettingRadioButton
    {...props}
    className={`${RadioCss} ${props.className || ""}`}
  />
)

export const PaymentSettingItem: FC<HTMLAttributes<HTMLDivElement>> = (
  props,
) => (
  <div
    {...props}
    className={`payment group flex flex-row items-center text-sm py-4 ${props.className || ""}`}
  />
)

export const PaymentSettingError: FC<HTMLAttributes<HTMLDivElement>> = (
  props,
) => (
  <div
    {...props}
    className={`${ErrorCss} text-sm pl-6 pb-4 ${props.className || ""}`}
  />
)

// Gift cards on the payment_sessions model. A gift card is a payment here, not
// a discount, so it lives in the payment step rather than beside the coupon.
export const GiftCardWrapper: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div {...props} className={`payment-wrapper pb-4 ${props.className || ""}`} />
)

export const GiftCardTitle: FC<HTMLAttributes<HTMLParagraphElement>> = (
  props,
) => (
  <p
    {...props}
    className={`text-sm font-medium text-gray-700 pb-2 ${props.className || ""}`}
  />
)

export const GiftCardRow: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div
    {...props}
    className={`flex items-center gap-2 text-sm py-1 ${props.className || ""}`}
  />
)

export const GiftCardInputRow: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div {...props} className={`flex gap-2 pt-2 ${props.className || ""}`} />
)

export const StyledGiftCardSessionInput: FC<any> = (props) => (
  <PaymentSettingGiftCardInput
    {...props}
    className={`${InputCss} flex-1 ${props.className || ""}`}
  />
)

export const StyledGiftCardSessionSubmit: FC<any> = (props) => (
  <PaymentSettingGiftCardSubmitButton
    {...props}
    className={`${ButtonCss} ${props.className || ""}`}
  />
)

export const StyledGiftCardSessionAdd: FC<any> = (props) => (
  <PaymentSettingGiftCardAddButton
    {...props}
    className={`text-sm text-primary underline cursor-pointer ${props.className || ""}`}
  />
)

export const StyledGiftCardSessionRemove: FC<any> = (props) => (
  <PaymentSettingGiftCardRemoveButton
    {...props}
    className={`text-xs text-gray-500 hover:text-red-500 cursor-pointer ${props.className || ""}`}
  />
)
