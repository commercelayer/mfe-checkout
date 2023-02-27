import styled from "styled-components"
import tw from "twin.macro"

interface Props {
  className?: string
  rounded?: boolean
  children?: JSX.Element[] | JSX.Element | null
  // address: string
  // user: string
}

export const CardAddress: React.FC<Props> = ({
  className,
  // address,
  // user,
  children,
}) => <Wrapper className={className}>{children}</Wrapper>

interface WrapperProps {
  rounded?: boolean
  fullHeight?: boolean
}

const Wrapper = styled.div<WrapperProps>`
  ${tw`bg-white pb-10 px-4 shadow-md rounded-md  p-5`}
`
