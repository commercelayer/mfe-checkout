import styled from "styled-components"
import tw from "twin.macro"

export const StepSummary = styled.div`
  ${tw`flex flex-row justify-around text-sm py-1 border-b items-center`}
`
export const StepSummaryItem = styled.div`
  ${tw`flex flex-1 font-bold`}
`
export const StepSummaryItemDescription = styled.p`
  ${tw`text-gray-500 ml-3 font-normal`}
`
export const StepSummaryItemValue = styled.p`
  ${tw`flex font-bold uppercase text-ss leading-8`}
`
