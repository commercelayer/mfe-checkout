import { ShippingMethodRadioButton } from "@commercelayer/react-components"
import styled from "styled-components"
import tw from "twin.macro"

import { RadioCss } from "components/ui/form/RadioButton"

export const ShippingWrapper = styled.div`
  ${tw`mb-5`}
  :not(:first-of-type) {
    ${tw`pt-5 mt-5 border-dashed border-t-2`}
  }
`
export const ShippingTitle = styled.h4`
  ${tw`font-bold text-md mb-2`}
`
export const ShippingSummary = styled.div`
  ${tw`contents`}
  input:checked + label {
    ${tw`border-2 border-primary shadow-md bg-gray-50`}
  }
`
export const ShippingSummaryItem = styled.div`
  ${tw`flex flex-1 font-bold ml-2 flex-col md:flex-row`}
`
export const ShippingSummaryItemDescription = styled.p`
  ${tw`text-gray-500 font-normal text-ss`}
`
export const ShippingSummaryValue = styled.p`
  ${tw`text-black font-bold uppercase text-sm pt-2`}
`
export const ShippingLineItem = styled.div`
  ${tw`flex mt-4`}
`
export const ShippingLineItemDescription = styled.div`
  ${tw`flex flex-col ml-3`}
`
export const ShippingLineItemTitle = styled.h5`
  ${tw`text-black text-sm font-bold`}
`
export const ShippingLineItemQty = styled.p`
  ${tw`text-xs text-gray-400 uppercase pt-1`}
`
export const StyledShippingMethodRadioButton = styled(
  ShippingMethodRadioButton
)`
  ${RadioCss}
  ${tw`hidden`}
`
