import styled from "styled-components"
import tw from "twin.macro"

import { Base } from "components/ui/Base"
import { Card } from "components/ui/Card"
import { Container } from "components/ui/Container"

interface Props {
  aside: React.ReactNode
  main: React.ReactNode
}

export const LayoutDefault: React.FC<Props> = ({ main, aside }) => {
  return (
    <Base>
      <Container>
        <Wrapper>
          <Aside>{aside}</Aside>
          <Main>
            <Card fullHeight>{main}</Card>
          </Main>
        </Wrapper>
      </Container>
    </Base>
  )
}

const Wrapper = styled.div`
  ${tw`grid md:grid-cols-3 gap-4`}
`

const Main = styled.div`
  ${tw`md:col-span-2`}
`

const Aside = styled.div`
  ${tw`pt-10 px-7 md:pl-0 md:pr-7`}
`
