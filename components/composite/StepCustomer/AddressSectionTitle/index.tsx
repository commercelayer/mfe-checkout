import styled from "styled-components"
import tw from "twin.macro"

export const AddressSectionTitle: React.FC = ({ children, ...rest }) => {
  return <Wrapper {...rest}>{children}</Wrapper>
}

const Wrapper = styled.h3`
  ${tw`mt-4 mb-2 font-normal text-black text-sm`}
`
