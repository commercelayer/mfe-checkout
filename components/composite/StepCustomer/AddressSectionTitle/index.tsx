import styled from "styled-components"
import tw from "twin.macro"

export const AddressSectionTitle: React.FC = ({ children }) => {
  return <Wrapper>{children}</Wrapper>
}

const Wrapper = styled.h3`
  ${tw`mt-2 mb-2 font-normal text-sm`}
`
