import { NextPage } from "next"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import tw from "twin.macro"

import { Base } from "components/ui/Base"
import { Container } from "components/ui/Container"
import { Footer } from "components/ui/Footer"
import { Logo } from "components/ui/Footer/cl"

const Invalid: NextPage = () => {
  const { t } = useTranslation()

  return (
    <Base>
      <Container>
        <Wrapper>
          <LogoWrapper>
            <FullLogo className="self-center text-black md:pl-4 md:self-auto" />
          </LogoWrapper>
          <Main>
            <Error>
              <ErrorCode>404</ErrorCode>
              <Text data-test-id="invalid-checkout">
                {t("general.invalid")}
              </Text>
            </Error>
          </Main>
          <Footer />
        </Wrapper>
      </Container>
    </Base>
  )
}

const Main = styled.div`
  ${tw`flex flex-col flex-1 justify-center items-center text-center`}
`
const Wrapper = styled.div`
  ${tw`flex flex-wrap justify-end items-stretch flex-col h-screen p-5 md:p-10 lg:px-20 lg:pb-10`}
`
const Text = styled.p`
  ${tw`p-4 text-sm font-normal text-gray-500`}
`
const Error = styled.div`
  ${tw`flex flex-col items-center md:(flex-row)`}
`
const ErrorCode = styled.p`
  ${tw`p-4 text-xl font-bold border-gray-300 text-gray-800 border-b  md:(border-r border-b-0)`}
`
const LogoWrapper = styled.div`
  ${tw`md:max-w-xs`}
`
const FullLogo = styled(Logo)`
  ${tw`text-black`}
`

export default Invalid
