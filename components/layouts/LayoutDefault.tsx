import styled from "styled-components"
import tw from "twin.macro"

const Wrapper = styled.div`
  ${tw`grid md:grid-cols-3 gap-4`}
`

const Main = styled.div`
  ${tw`md:col-span-2`}
`

const Aside = styled.div`
  display: block;
`

export const LayoutDefault = {
  Wrapper,
  Main,
  Aside,
}
