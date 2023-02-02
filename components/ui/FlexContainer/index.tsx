import styled from "styled-components"
import tw from "twin.macro"

interface Props {
  className?: string
  children?: JSX.Element[] | JSX.Element | null
}

export const FlexContainer: React.FC<Props> = ({ children, className }) => (
  <Wrapper className={className}>{children}</Wrapper>
)

const Wrapper = styled.div`
  ${tw`flex justify-start`}
`
