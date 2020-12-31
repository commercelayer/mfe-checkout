import styled from "styled-components"
import tw from "twin.macro"

export const AddressSectionTitle: React.FC = ({ children }) => {
  return <Wrapper>{children}</Wrapper>
}

const Wrapper = styled.h4`
  ${tw`mb-4 font-bold text-gray-900 leading-6`}
`
