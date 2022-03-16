import { LineItemCode, LineItemOption } from "@commercelayer/react-components"
import styled from "styled-components"
import tw from "twin.macro"

export const LineItemWrapper = styled.div`
  ${tw`flex flex-row mb-7 pb-6 border-b`}
`
export const LineItemDescription = styled.div`
  ${tw`pl-4 flex flex-col flex-1 lg:pl-8`}
`
export const LineItemTitle = styled.div`
  ${tw`flex justify-between text-black`}
`
export const LineItemQty = styled.div`
  ${tw`text-xs mt-1 bg-gray-200 max-w-max py-1 px-2.5 rounded-full tracking-wider text-gray-400 font-bold`}
`
export const StyledLineItemSkuCode = styled(LineItemCode)`
  ${tw`text-xxs uppercase text-gray-400 font-bold`}
`
export const StyledLineItemOption = styled(LineItemOption)`
  ${tw`text-gray-400 text-xs flex font-medium capitalize pl-5 mt-1.5 bg-no-repeat bg-16`}
  span {
    ${tw`font-bold text-gray-500 ml-1 line-clamp-3 md:line-clamp-6`}
  }

  &:not(span) {
    ${tw`font-medium`}
  }

  &:last-of-type {
    ${tw`mb-1.5`}
  }

  background-image: url("data:image/svg+xml;utf8;base64, PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGNsYXNzPSJoLTUgdy01IiB2aWV3Qm94PSIwIDAgMjAgMjAiIGZpbGw9ImN1cnJlbnRDb2xvciI+CiAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTAuMjkzIDUuMjkzYTEgMSAwIDAxMS40MTQgMGw0IDRhMSAxIDAgMDEwIDEuNDE0bC00IDRhMSAxIDAgMDEtMS40MTQtMS40MTRMMTIuNTg2IDExSDVhMSAxIDAgMTEwLTJoNy41ODZsLTIuMjkzLTIuMjkzYTEgMSAwIDAxMC0xLjQxNHoiIGNsaXAtcnVsZT0iZXZlbm9kZCIgLz4KPC9zdmc+");
`
