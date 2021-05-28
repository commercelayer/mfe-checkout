import styled from "styled-components"
import tw from "twin.macro"

export const SummaryHeader = styled.div`
  ${tw`mb-12`}
`
export const SummaryTitle = styled.h2`
  ${tw`text-xl font-semibold`}
`
export const SummarySubTitle = styled.p`
  ${tw`text-gray-500`}
`
export const TotalWrapper = styled.div`
  ${tw`flex flex-row`}
`
export const AmountWrapper = styled.div`
  ${tw`flex flex-col flex-1 lg:pl-8`}
`
export const AmountSpacer = styled.div`
  ${tw`hidden lg:flex lg:flex-85`}
`
export const RecapLine = styled.div`
  ${tw`flex flex-row justify-between py-0.5`}

  &:empty {
    ${tw`hidden`}
  }
`
export const RecapLineItem = styled.p`
  ${tw`font-semibold`}
`
export const RecapLineTotal = styled(RecapLine)`
  ${tw`border-t border-gray-500 mt-7 pt-6`}
`
export const RecapLineItemTotal = styled(RecapLineItem)`
  ${tw`text-xl font-normal invisible lg:visible`}
`
