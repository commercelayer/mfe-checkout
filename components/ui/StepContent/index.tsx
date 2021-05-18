import styled from "styled-components"
import tw from "twin.macro"

export const StepContent: React.FC = ({ children }) => {
  return <Wrapper>{children}</Wrapper>
}

const Wrapper = styled.div`
  ${tw`relative pl-3 w-full pointer-events-auto transition duration-300 ease-in-out`}
  .done & {
    filter: grayscale(80%) opacity(50%);

    &:hover {
      filter: none;
    }
  }
`
