import styled from "styled-components"
import tw from "twin.macro"

export const Base = ({ children }: { children?: JSX.Element[] | JSX.Element }) => <Wrapper>{children}</Wrapper>

const Wrapper = styled.div`
  ${tw`bg-gray-50 min-h-screen w-auto`}
`
