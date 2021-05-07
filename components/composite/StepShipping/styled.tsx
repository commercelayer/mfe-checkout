import styled from "styled-components"
import tw from "twin.macro"

export const ShippingWrapper = styled.div`
  ${tw`border border-gray-300 mb-5 p-3 rounded`}
`
export const ShippingTitle = styled.h4`
  ${tw`font-bold text-md mb-2`}
`
export const ShippingSummary = styled.div`
  ${tw`flex flex-row justify-around text-sm items-center`}
`
export const ShippingSummaryItem = styled.div`
  ${tw`flex flex-1 font-bold ml-2`}
`
export const ShippingSummaryItemDescription = styled.p`
  ${tw`text-gray-600 ml-3 font-normal`}
`
export const ShippingSummaryValue = styled.p`
  ${tw`flex font-bold uppercase text-ss leading-8`}
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
