import styled from "styled-components"
import tw from "twin.macro"

interface Props {
  className?: string
}

export const GridContainer: React.FC<Props> = ({ children, className }) => (
  <Wrapper className={className}>{children}</Wrapper>
)

const Wrapper = styled.div`
  ${tw`grid grid-cols-1 md:grid-cols-2 md:gap-4`}
`
