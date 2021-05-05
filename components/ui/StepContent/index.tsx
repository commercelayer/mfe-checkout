import styled from "styled-components"
import tw from "twin.macro"

export const StepContent: React.FC = ({ children }) => {
  return <Wrapper>{children}</Wrapper>
}

const Wrapper = styled.div`
  ${tw`m-3 pl-6 py-4 border-l border-solid border-gray-200`}
`
