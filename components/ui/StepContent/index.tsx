import styled from "styled-components"
import tw from "twin.macro"

export const StepContent = ({ children }: { children?: ChildrenType }) => {
  return <Wrapper>{children}</Wrapper>
}

const Wrapper = styled.div`
  ${tw`relative w-full pointer-events-auto`}
`
