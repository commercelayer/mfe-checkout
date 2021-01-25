import styled from "styled-components"
import tw from "twin.macro"

interface Props {
  className?: string
  rounded?: boolean
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
const FullName = styled.h4`
  ${tw`mb-4 font-bold text-xl`}
`
const Address = styled.h4`
  ${tw`mb-4 text-sm`}
`
const Button = styled.button`
  ${tw`flex mt-3  items-center justify-center px-1 text-base font-medium text-blue-500 border border-transparent rounded-md`}
`
