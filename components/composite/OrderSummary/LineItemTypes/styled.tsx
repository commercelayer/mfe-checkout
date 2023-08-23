import { LineItemCode } from "@commercelayer/react-components/line_items/LineItemCode"
import { LineItemOptions } from "@commercelayer/react-components/line_items/LineItemOptions"
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
  ${tw`text-xs bg-gray-100 max-w-max py-1 px-2.5 rounded lowercase text-gray-500 font-bold first-letter:uppercase`}
`
export const LineItemFrequency = styled(LineItemQty)`
  ${tw`mt-2 flex bg-white border border-primary text-primary lg:mt-0`}
`

export const StyledLineItemSkuCode = styled(LineItemCode)`
  ${tw`text-xxs uppercase text-gray-400 font-bold mb-1`}
`
export const StyledLineItemOptions = styled(LineItemOptions)`
  h6 {
    ${tw`font-bold text-xs text-gray-600 mt-2 bg-no-repeat bg-16 pl-5`}
    background-image: url("data:image/svg+xml;utf8;base64, PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGNsYXNzPSJoLTUgdy01IiB2aWV3Qm94PSIwIDAgMjAgMjAiIGZpbGw9ImN1cnJlbnRDb2xvciI+CiAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTAuMjkzIDUuMjkzYTEgMSAwIDAxMS40MTQgMGw0IDRhMSAxIDAgMDEwIDEuNDE0bC00IDRhMSAxIDAgMDEtMS40MTQtMS40MTRMMTIuNTg2IDExSDVhMSAxIDAgMTEwLTJoNy41ODZsLTIuMjkzLTIuMjkzYTEgMSAwIDAxMC0xLjQxNHoiIGNsaXAtcnVsZT0iZXZlbm9kZCIgLz4KPC9zdmc+");
  }

  li {
    ${tw`text-gray-400 text-xs flex font-medium capitalize pl-5 pt-1 bg-no-repeat bg-16`}
    span {
      ${tw`font-bold text-gray-500 ml-1 line-clamp-3 md:line-clamp-6`}
    }

    &:not(span) {
      ${tw`font-medium`}
    }

    &:last-of-type {
      ${tw`mb-2`}
    }
  }
`
