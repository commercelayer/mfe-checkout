import styled from "styled-components"
import tw from "twin.macro"

import { Base } from "components/ui/Base"
import { Card } from "components/ui/Card"
import { Container } from "components/ui/Container"

interface Props {
  aside: ChildrenType
  main: ChildrenType
}

export const LayoutDefault: React.FC<Props> = ({ main, aside }) => {
  return (
    <Base>
      <Container>
        <Wrapper>
          <Aside>{aside}</Aside>
          <Main>
            <Card $fullHeight>{main}</Card>
          </Main>
        </Wrapper>
      </Container>
    </Base>
  )
}

const Wrapper = styled.div`
  ${tw`flex flex-wrap justify-end items-stretch flex-col min-h-full md:h-screen md:flex-row`}
`

const Main = styled.div`
  ${tw`flex-none md:flex-1 justify-center order-first md:order-last`}
`

const Aside = styled.div`
  ${tw`flex-none md:flex-1`}
`
