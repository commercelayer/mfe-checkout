import styled from "styled-components"
import tw from "twin.macro"

interface Props {
  main: React.ReactNode
}

export const LayoutBaseAmount: React.FC<Props> = ({ main }) => {
  return <Wrapper>{main}</Wrapper>
}

const Wrapper = styled.h2`
  ${tw`text-sm font-bold flex flex-row justify-between pb-2`}
`
