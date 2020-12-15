import styled from "styled-components"
import tw from "twin.macro"

export const Card: React.FC = ({ children }) => <Wrapper>{children}</Wrapper>

const Wrapper = styled.div`
  ${tw`bg-white rounded-md p-4 shadow-md`}
`
