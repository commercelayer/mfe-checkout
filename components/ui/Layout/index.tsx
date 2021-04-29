import * as S from "components/ui"
import styled from "styled-components"
import tw from "twin.macro"

interface Props {
  aside: React.ReactNode
  main: React.ReactNode
}

export const Layout: React.FC<Props> = ({ main, aside }) => {
  return (
    <S.Base>
      <S.Container>
        <Wrapper>
          <Aside>{aside}</Aside>
          <Main>
            <S.Card fullHeight>{main}</S.Card>
          </Main>
        </Wrapper>
      </S.Container>
    </S.Base>
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
