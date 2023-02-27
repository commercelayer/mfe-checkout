import styled from "styled-components"
import tw from "twin.macro"

export const StepContent = ({ children }: { children?: JSX.Element[] | JSX.Element | null }) => {
  return <Wrapper>{children}</Wrapper>
}

const Wrapper = styled.div`
  ${tw`relative w-full pointer-events-auto`}
`
