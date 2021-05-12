import { GiftCardOrCouponRemoveButton } from "@commercelayer/react-components"
import styled from "styled-components"
import tw from "twin.macro"

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
