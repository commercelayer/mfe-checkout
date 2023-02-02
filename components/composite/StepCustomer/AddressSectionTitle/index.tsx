import styled from "styled-components"
import tw from "twin.macro"

interface Props {
  children?: JSX.Element[] | JSX.Element
}

export const AddressSectionTitle = ({ children, ...rest }: Props): JSX.Element => {
  return <Wrapper {...rest}>{children}</Wrapper>
}

const Wrapper = styled.h3`
  ${tw`mt-4 mb-2 font-normal text-black text-sm`}
`
