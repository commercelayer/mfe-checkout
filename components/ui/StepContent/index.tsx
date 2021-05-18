import styled from "styled-components"
import tw from "twin.macro"

interface Props {
  className: string
}

export const StepContent: React.FC<Props> = ({ children, className }) => {
  return <Wrapper className={className}>{children}</Wrapper>
}

const Wrapper = styled.div`
  ${tw`relative pl-3 w-full`}
`
