import {
  GiftCardOrCouponRemoveButton,
  GiftCardOrCouponInput,
  Errors,
} from "@commercelayer/react-components"
import styled from "styled-components"
import tw from "twin.macro"

import { ErrorCss } from "components/ui/form/Error"
import { InputCss } from "components/ui/form/Input"

export const CouponFormWrapper = styled.div`
  ${tw`pb-8 mb-8 border-b`}
`
export const CouponFieldWrapper = styled.div`
  ${tw`flex mt-1`}
`
export const CouponRecap = styled.div`
  ${tw`flex flex-row justify-between pb-5 mb-6 border-b`}
`
export const CouponName = styled.p`
  ${tw`font-bold uppercase`}
`
export const StyledGiftCardOrCouponRemoveButton = styled(
  GiftCardOrCouponRemoveButton
)`
  ${tw`ml-2 text-sm font-bold text-primary border-b leading-none border-black border-opacity-10 md: transition ease-in duration-200 hover:border-opacity-50 hover:text-primary-dark focus:outline-none`}
`

export const StyledGiftCardOrCouponInput = styled(GiftCardOrCouponInput)`
  ${InputCss}
  ${tw`rounded-none rounded-l-md z-10`}
  &.hasError {
    ${tw`placeholder-red-400 border-red-400 border-2 focus:ring-offset-0 focus:ring-red-400 focus:ring-opacity-50`}
  }
`
export const StyledErrors = styled(Errors)`
  ${ErrorCss}
  ${tw`pl-0`}
`
