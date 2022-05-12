import styled from "styled-components"
import tw from "twin.macro"

export const Message = styled.div`
  ${tw`my-8 text-gray-400`}
  > br {
    ${tw`hidden md:block`}
  }
  + div {
    ${tw`mt-0`}
  }
`
