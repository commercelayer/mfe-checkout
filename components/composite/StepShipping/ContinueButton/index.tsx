import styled from "styled-components"
import tw from "twin.macro"

export const ContinueButton: React.FC = ({ children }) => {
  return <Wrapper>{children}</Wrapper>
}
const Wrapper = styled.p`
  ${tw`p-2 mt-5`}
`
