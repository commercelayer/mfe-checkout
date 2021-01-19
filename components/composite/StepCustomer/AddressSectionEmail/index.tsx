import styled from "styled-components"
import tw from "twin.macro"

export const AddressSectionEmail: React.FC = ({ children }) => {
  return <Wrapper>{children}</Wrapper>
}

const Wrapper = styled.h4`
  ${tw`mb-4`}
`
