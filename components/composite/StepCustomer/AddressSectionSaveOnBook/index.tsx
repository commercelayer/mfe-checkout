import styled from "styled-components"
import tw from "twin.macro"

export const AddressSectionSaveOnBook: React.FC = ({ children }) => {
  return <Wrapper>{children}</Wrapper>
}

const Wrapper = styled.p`
  ${tw`mb-4 font-bold text-gray-900 leading-6`}
`
