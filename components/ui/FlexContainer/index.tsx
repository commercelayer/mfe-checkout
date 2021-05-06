import styled from "styled-components"
import tw from "twin.macro"

export const FlexContainer: React.FC = ({ children }) => (
  <Wrapper>{children}</Wrapper>
)

const Wrapper = styled.div`
  ${tw`flex justify-start`}
`
