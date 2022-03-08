import styled from "styled-components"
import tw from "twin.macro"

import { FlexContainer } from "components/ui/FlexContainer"

export const Top = styled.div`
  ${tw`bg-white`}
`
export const Bottom = styled.div`
  ${tw`bg-gray-50`}
`

export const Main = styled.div`
  ${tw`flex flex-col justify-center items-center text-center`}
`
export const Wrapper = styled.div`
  ${tw`flex flex-col p-5 md:p-10 lg:px-20 2xl:(max-w-screen-2xl mx-auto)`}
`
export const Title = styled.h1`
  ${tw`text-black text-2xl lg:text-4xl font-semibold mb-4`}
`
export const Text = styled.p`
  ${tw`py-2`}
`
export const Message = styled.div`
  ${tw`my-8 text-gray-400`}
  > br {
    ${tw`hidden md:block`}
  }
`
export const WrapperButton = styled.div`
  ${tw`flex items-center justify-center`}
`
export const Recap = styled.div`
  ${tw`grid md:(auto-cols-fr grid-flow-col gap-16) lg:gap-32`}
`
export const RecapSummary = styled.div`
  ${tw`order-last border-t border-dashed border-t-2 pt-6 md:(order-first border-0 p-0)`}
`
export const RecapCustomer = styled.div`
  ${tw`text-black order-1 md:order-2 mb-5 md:mb-0`}
`
export const RecapTitle = styled.h2`
  ${tw`text-black text-lg font-semibold leading-none mb-8 md:mb-16`}
`
export const RecapCol = styled.div`
  ${tw`mb-4 md:mb-8`}
`
export const RecapItemTitle = styled.h3`
  ${tw`font-normal text-sm mb-2`}
`
export const RecapItem = styled.p`
  ${tw`text-md font-bold`}
`
export const RecapItemDescription = styled.p`
  ${tw`text-sm font-semibold`}
`
export const RecapBox = styled.div`
  ${tw`p-3 rounded border`}
`
export const AddressContainer = styled(FlexContainer)`
  ${tw`flex-col gap-y-4 xl:(flex-row gap-4 justify-between)`}
  > div {
    ${tw`flex-1`}
  }
`
