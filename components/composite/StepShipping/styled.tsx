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
  ${tw`border border-gray-300 mb-2.5 p-2 rounded flex flex-row justify-around text-sm md:(border-0 mb-0 p-0 items-center)`}
  &.active {
    ${tw`bg-gray-100 border-2 border-primary`}
  }
`
export const ShippingSummaryItem = styled.div`
  ${tw`flex flex-1 font-bold ml-2 flex-col md:flex-row`}
`
export const ShippingSummaryItemDescription = styled.p`
  ${tw`text-gray-600 font-normal md:ml-3`}
`
export const ShippingSummaryValue = styled.p`
  ${tw`flex font-bold uppercase text-ss md:leading-8`}
`
export const ShippingLineItem = styled.div`
  ${tw`flex mt-4`}
`
export const ShippingLineItemDescription = styled.div`
  ${tw`flex flex-col ml-3`}
`
export const ShippingLineItemTitle = styled.h5`
  ${tw`text-sm font-bold`}
`
export const ShippingLineItemQty = styled.p`
  ${tw`text-xs text-gray-500 uppercase pt-1`}
`
export const StyledShippingMethodRadioButton = styled(
  ShippingMethodRadioButton
)`
  ${RadioCss}
`
