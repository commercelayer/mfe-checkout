import styled from "styled-components"
import tw from "twin.macro"

interface Props {
  className: string
}

export const StepContainer: React.FC<Props> = ({ children, className }) => (
  <Container className={className}>{children}</Container>
)

const Container = styled.div`
  ${tw`flex flex-row items-stretch justify-start px-5 mb-10 py-5 -mx-5 bg-white shadow-bottom md:shadow-none md:-mx-0 md:px-0 md:py-0 transition duration-1000 ease-out`}
  &.submitting {
    filter: opacity(25%);
  }

  &:nth-last-of-type(1) {
    ${tw`mb-0`}
  }
`
