import Errors from "@commercelayer/react-components/errors/Errors"
import GiftCardOrCouponInput from "@commercelayer/react-components/gift_cards/GiftCardOrCouponInput"
import GiftCardOrCouponRemoveButton from "@commercelayer/react-components/gift_cards/GiftCardOrCouponRemoveButton"
import GiftCardOrCouponSubmit from "@commercelayer/react-components/gift_cards/GiftCardOrCouponSubmit"
import { ButtonCss } from "components/ui/Button"
import { ErrorCss } from "components/ui/form/Error"
import { InputCss } from "components/ui/form/Input"
import type { FC } from "react"

export const CouponFormWrapper: FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => <div {...props} className="pb-8 mb-8 border-b" />

export const CouponFieldWrapper: FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => <div {...props} className="flex mt-1" />

export const CouponRecap: FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => (
  <div
    {...props}
    className="flex flex-row justify-between pb-5 mb-6 border-b"
  />
)

export const CouponName: FC<React.HTMLAttributes<HTMLParagraphElement>> = (
  props,
) => <p {...props} className="font-bold" />

export const StyledGiftCardOrCouponRemoveButton: FC<
  React.ComponentProps<typeof GiftCardOrCouponRemoveButton>
> = (props) => (
  <GiftCardOrCouponRemoveButton
    {...props}
    className={`ml-2 text-sm font-bold text-primary border-b leading-none border-black border-opacity-10 transition ease-in duration-200 hover:border-opacity-50 hover:text-primary-dark focus:outline-none ${props.className || ""}`}
  />
)

export const StyledGiftCardOrCouponInput: FC<
  React.ComponentProps<typeof GiftCardOrCouponInput>
> = (props) => (
  <GiftCardOrCouponInput
    {...props}
    className={`${InputCss} rounded-none rounded-l-md z-10 [&.hasError]:placeholder-red-400 [&.hasError]:border-red-400 [&.hasError]:border-2 [&.hasError]:focus:ring-offset-0 [&.hasError]:focus:ring-red-400 [&.hasError]:focus:ring-opacity-50 ${props.className || ""}`}
  />
)

export const StyledGiftCardOrCouponSubmit: FC<
  React.ComponentProps<typeof GiftCardOrCouponSubmit>
> = (props) => (
  <GiftCardOrCouponSubmit
    {...props}
    className={`${ButtonCss} w-auto -ml-px relative space-x-2 px-8 py-3 border-transparent rounded-none rounded-r-md ${props.className || ""}`}
  />
)

export const StyledErrors: FC<React.ComponentProps<typeof Errors>> = (
  props,
) => (
  <Errors {...props} className={`${ErrorCss} pl-0 ${props.className || ""}`} />
)
