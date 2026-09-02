import {
  PaymentMethodRadioButton,
  PaymentSettingGiftCardErrors,
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
import type {
  FC,
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
} from "react"

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

// payment_sessions model.
//
// Card-per-setting rather than rows in a single box: each option is its own
// target, which is what makes the selected one showable as a highlighted card.
// `isSelected` reaches here through <PaymentSetting>'s function children.
export const PaymentSettingCard: FC<
  LabelHTMLAttributes<HTMLLabelElement> & { isSelected?: boolean }
> = ({ isSelected, ...props }) => (
  // biome-ignore lint/a11y/noLabelWithoutControl: htmlFor comes from the caller, the only place the setting id is known
  <label
    {...props}
    className={`block border rounded-md px-4 py-4 mb-3 cursor-pointer transition duration-200 ease-in ${
      isSelected === true
        ? "border-primary bg-primary/5"
        : "border-gray-200 bg-gray-50 hover:border-gray-300"
    } ${props.className || ""}`}
  />
)

// Visually hidden rather than absent: the card is a <label> pointing at this
// input, so it is what makes clicking anywhere on the card select the setting,
// and what a keyboard and a screen reader still reach. `sr-only` keeps all of
// that; `hidden` would throw it away and leave the card inert.
export const StyledPaymentSettingRadioButton: FC<any> = (props) => (
  <PaymentSettingRadioButton
    {...props}
    className={`sr-only ${props.className || ""}`}
  />
)

export const PaymentSettingItem: FC<HTMLAttributes<HTMLDivElement>> = (
  props,
) => (
  <div
    {...props}
    className={`payment group flex flex-row items-center text-base font-bold ${props.className || ""}`}
  />
)

export const PaymentSettingError: FC<HTMLAttributes<HTMLDivElement>> = (
  props,
) => (
  <div
    {...props}
    className={`${ErrorCss} text-sm pl-0 ${props.className || ""}`}
  />
)

// Gift cards on the payment_sessions model. A gift card is a payment here, not
// a discount, so it lives in the payment step rather than beside the coupon.
export const GiftCardWrapper: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div
    {...props}
    className={`border border-gray-200 rounded-md px-4 py-4 ${props.className || ""}`}
  />
)

export const GiftCardHeader: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div
    {...props}
    className={`flex items-center justify-between ${props.className || ""}`}
  />
)

export const GiftCardTitle: FC<HTMLAttributes<HTMLParagraphElement>> = (
  props,
) => (
  <p
    {...props}
    className={`text-base font-bold text-black ${props.className || ""}`}
  />
)

// Same switch as components/ui/Toggle, without that component's own row
// wrapper: here the label sits on the left and the switch on the right.
interface GiftCardSwitchProps {
  checked: boolean
  label: string
  onChange: () => void
  "data-testid"?: string
}

export const GiftCardSwitch: FC<GiftCardSwitchProps> = ({
  checked,
  label,
  onChange,
  ...rest
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={onChange}
    data-state={checked ? "checked" : "unchecked"}
    className="relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out bg-gray-200 data-[state=checked]:bg-primary focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer"
    {...rest}
  >
    <span
      aria-hidden="true"
      data-state={checked ? "checked" : "unchecked"}
      className="inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out data-[state=checked]:translate-x-4"
    />
  </button>
)

// Spacing lives on the container: the rows, the input and the link come and go
// independently, and a bottom margin on each leaves a gap under whichever
// happens to be last.
export const GiftCardBody: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div {...props} className={`pt-4 space-y-3 ${props.className || ""}`} />
)

export const GiftCardRow: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div
    {...props}
    className={`flex items-center gap-3 text-sm border border-gray-200 rounded-md px-3 py-3 ${props.className || ""}`}
  />
)

export const GiftCardIcon: FC<HTMLAttributes<HTMLSpanElement>> = (props) => (
  <span
    {...props}
    aria-hidden="true"
    className={`flex items-center justify-center w-8 h-8 shrink-0 rounded-sm bg-gray-100 text-gray-400 ${props.className || ""}`}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4"
    >
      <title>Gift card</title>
      <path d="M3 8h14v8a2 2 0 0 1-2 2h-4V8H3Zm6 10H5a2 2 0 0 1-2-2V8h6v10ZM2 4.5A1.5 1.5 0 0 1 3.5 3h13A1.5 1.5 0 0 1 18 4.5V6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4.5Z" />
    </svg>
  </span>
)

// The input and Apply read as one control, so the button loses its own left
// radius and the app-wide full-width rule from ButtonCss.
export const GiftCardInputRow: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div {...props} className={`flex ${props.className || ""}`} />
)

export const StyledGiftCardSessionInput: FC<any> = (props) => (
  <PaymentSettingGiftCardInput
    {...props}
    className={`${InputCss} flex-1 rounded-r-none ${props.className || ""}`}
  />
)

export const StyledGiftCardSessionSubmit: FC<any> = (props) => (
  <PaymentSettingGiftCardSubmitButton
    {...props}
    className={`${ButtonCss} w-auto! lg:w-auto! rounded-l-none px-6 ${props.className || ""}`}
  />
)

// Opening the input again after a card has been applied. Plain markup: which
// controls are on screen is this application's business, not the library's.
export const GiftCardAddLink: FC<HTMLAttributes<HTMLButtonElement>> = (
  props,
) => (
  <button
    {...props}
    type="button"
    className={`text-sm text-primary underline cursor-pointer ${props.className || ""}`}
  />
)

// Gift card failures are rejected before anything is written to the order, so
// they never reach <Errors resource="orders"> — they need their own outlet, the
// same way a failed payment setting selection does.
export const StyledGiftCardSessionError: FC<any> = (props) => (
  <PaymentSettingGiftCardErrors
    {...props}
    className={`${ErrorCss} text-sm pt-2 ${props.className || ""}`}
  />
)

export const StyledGiftCardSessionRemove: FC<any> = (props) => (
  <PaymentSettingGiftCardRemoveButton
    {...props}
    className={`text-sm text-primary underline cursor-pointer ${props.className || ""}`}
  />
)
