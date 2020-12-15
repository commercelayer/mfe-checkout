import styled from "styled-components"
import tw from "twin.macro"

export const Container: React.FC = ({ children }) => (
  <Wrapper>{children}</Wrapper>
)

const Wrapper = styled.div`
  ${tw`container mx-auto`}
`
