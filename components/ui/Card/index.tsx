import styled from "styled-components"
import tw from "twin.macro"

interface Props {
  className?: string
  rounded?: boolean
  fullHeight?: boolean
}

export const Card: React.FC<Props> = ({
  children,
  className,
  rounded,
  fullHeight,
}) => (
  <Wrapper className={className} rounded={rounded} fullHeight={fullHeight}>
    {children}
  </Wrapper>
)

interface WrapperProps {
  rounded?: boolean
  fullHeight?: boolean
}

const Wrapper = styled.div<WrapperProps>`
  ${tw`p-5 md:p-10 md:pr-20 bg-white shadow-sm`}
  ${({ rounded }) => (rounded ? tw`rounded-md` : null)}
  ${({ fullHeight }) => (fullHeight ? tw`min-h-screen` : null)}
`
