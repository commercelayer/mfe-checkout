import { Base } from "components/ui/Base"
import { Container } from "components/ui/Container"
import { Footer } from "components/ui/Footer"

import { Wrapper, LogoWrapper, FullLogo, Main, Error } from "./styled"

export const ErrorContainer = ({ children }: { children: JSX.Element[] | JSX.Element | null }) => {
  return (
    <Base>
      <Container>
        <Wrapper>
          <LogoWrapper>
            <FullLogo className="self-center text-black md:pl-4 md:self-auto" />
          </LogoWrapper>
          <Main>
            <Error>{children}</Error>
          </Main>
          <Footer />
        </Wrapper>
      </Container>
    </Base>
  )
}
