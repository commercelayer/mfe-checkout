import {
  Errors,
  PlaceOrderButton,
  PrivacyAndTermsCheckbox,
} from "@commercelayer/react-components"
import { ButtonCss } from "components/ui/Button"
import { CheckCss } from "components/ui/form/CheckBox"
import { ErrorCss } from "components/ui/form/Error"
import type { FC, HTMLAttributes } from "react"

interface StyledPlaceOrderButtonProps
  extends React.ComponentProps<typeof PlaceOrderButton> {
  isActive: boolean
  className?: string
}

export const ErrorWrapper: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div
    {...props}
    className={`error-wrapper bg-red-50 flex justify-center border-2 border-red-400 ml-8 ${props.className || ""}`}
  />
)

export const ErrorIco: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div
    {...props}
    className={`flex items-center bg-red-400 ${props.className || ""}`}
  />
)

export const ErrorMessage: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div
    {...props}
    className={`${ErrorCss} flex-1 text-sm p-3 break-words break-all ${props.className || ""}`}
  />
)

export const StyledErrors: FC<React.ComponentProps<typeof Errors>> = (
  props,
) => (
  <Errors
    {...props}
    className={`${ErrorCss} pt-0 pl-0 text-sm p-3 ${props.className || ""}`}
  />
)

export const ErrorsContainer: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div {...props} className={`errors-container ${props.className || ""}`} />
)
export const StyledPlaceOrderButton: FC<StyledPlaceOrderButtonProps> = ({
  isActive,
  className = "",
  ...props
}) => (
  <PlaceOrderButton
    {...props}
    className={`${ButtonCss} ${isActive ? "inline-flex" : "hidden"} ${className}`}
  />
)

export const StyledPrivacyAndTermsCheckbox: FC<
  React.ComponentProps<typeof PrivacyAndTermsCheckbox>
> = (props) => (
  <PrivacyAndTermsCheckbox
    {...props}
    className={`${CheckCss} ${props.className || ""}`}
  />
)
