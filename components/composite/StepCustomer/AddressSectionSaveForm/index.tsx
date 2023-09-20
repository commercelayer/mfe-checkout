import styled from "styled-components"
import tw from "twin.macro"

interface Props {
  children?: JSX.Element[] | JSX.Element
}

export const AddressSectionSaveForm = ({ children }: Props): JSX.Element => {
  return <Wrapper>{children}</Wrapper>
}
const Wrapper = styled.div`
  ${tw``}
`
