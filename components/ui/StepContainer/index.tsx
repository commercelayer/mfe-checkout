import styled from "styled-components"
import tw from "twin.macro"

export const StepContainer: React.FC = ({ children }) => (
  <Container>{children}</Container>
)

const Container = styled.div`
  ${tw`flex flex-row items-stretch justify-start mb-10`}
  &:nth-last-of-type(1) {
    ${tw`mb-0`}
  }
`
