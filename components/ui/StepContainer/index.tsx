import styled from "styled-components"
import tw from "twin.macro"

interface Props {
  className: string
  children?: JSX.Element[] | JSX.Element | null
}

export const StepContainer: React.FC<Props> = ({ children, className }) => (
  <Container className={className}>{children}</Container>
)

const Container = styled.div`
  ${tw`flex flex-row items-stretch justify-start mb-10 pb-5 md:pb-5`}
  &.submitting {
    filter: opacity(25%);
  }

  &:nth-last-of-type(1) {
    ${tw`mb-0`}
  }
`
