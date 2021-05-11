import { PlaceOrderButton } from "@commercelayer/react-components"
import styled from "styled-components"
import tw from "twin.macro"

import { ButtonCss } from "components/ui/Button"
import { CheckCss } from "components/ui/form/CheckBox"

export const PaymentWrapper = styled.div`
  ${tw`border border-gray-300 mb-5 p-3 rounded bg-gray-50`}
  .active & {
    ${tw`bg-white`}
  }
`
export const PaymentSummary = styled.div`
  ${tw`flex flex-row justify-around text-sm items-center`}
`
export const PaymentSummaryItem = styled.div`
  ${tw`flex flex-1 font-bold leading-none`}
`
export const PaymentRadioContainer = styled.div`
  ${tw`mr-2`}
`
export const PaymentSummaryValue = styled.p`
  ${tw`flex font-bold uppercase text-ss leading-8`}
`
export const PaymentSourceContainer = styled.div`
  ${tw`mt-4`}
`
export const PaymentDetailsWrapper = styled.div`
  ${tw`flex flex-row items-center justify-start text-sm`}
`
export const PaymentItemTitle = styled.h5`
  ${tw`text-sm font-bold`}
`
export const ShippingLineItemQty = styled.p`
  ${tw`text-xs text-gray-500 uppercase pt-1`}
`
export const WalletCheckbox = styled.input`
  ${CheckCss}
`
export const StyledPlaceOrderButton = styled(PlaceOrderButton)`
  ${ButtonCss}
`
