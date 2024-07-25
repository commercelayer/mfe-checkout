import styled from "styled-components"
import tw from "twin.macro"

interface Props {
  className?: string
  rounded?: boolean
  $fullHeight?: boolean
  children?: ChildrenType
}

export const Card: React.FC<Props> = ({
  children,
  className,
  rounded,
  $fullHeight,
}) => (
  <Wrapper className={className} rounded={rounded} $fullHeight={$fullHeight}>
    {children}
  </Wrapper>
)

interface WrapperProps {
  rounded?: boolean
  $fullHeight?: boolean
}

const Wrapper = styled.div<WrapperProps>`
  ${tw`p-5 md:px-8 lg:px-12 lg:pt-10 xl:px-24 xl:pt-12 bg-gray-50 bg-white shadow-sm`}
  ${({ rounded }) => (rounded ? tw`rounded-md` : null)}
  ${({ $fullHeight }) => ($fullHeight ? tw`min-h-full ` : null)}
`
