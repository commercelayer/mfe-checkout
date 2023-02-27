import styled from "styled-components"
import tw from "twin.macro"

interface Props {
  className?: string
  children?: JSX.Element[] | JSX.Element
}

export const GridContainer = ({ children, className }: Props): JSX.Element => (
  <Wrapper className={className}>{children}</Wrapper>
)

const Wrapper = styled.div`
  ${tw`grid gap-y-4 lg:grid-cols-2 lg:gap-4`}
`
