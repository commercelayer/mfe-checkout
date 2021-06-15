import humanizeString from "humanize-string"
import { NextPage } from "next"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import titleize from "titleize"
import tw from "twin.macro"

import { Base } from "components/ui/Base"
import { Container } from "components/ui/Container"
import { Footer } from "components/ui/Footer"
import { Logo } from "components/ui/Footer/cl"

const Invalid: NextPage = () => {
  const { t } = useTranslation()
  const [title, setTitle] = useState("")

  useEffect(() => {
    if (window) {
      try {
        const humanizeHostname = titleize(
          humanizeString(window.location.hostname.split(".")[0])
        )
        setTitle(humanizeHostname)
      } catch (error) {
        console.log(error)
      }
    }
  }, [])

  return (
    <Base>
      <Container>
        <Wrapper>
          <LogoWrapper>
            <Logo tw="text-black md:pl-4 self-center md:self-auto" />
          </LogoWrapper>
          <Main>
            <Text>{t("general.invalid")}</Text>
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
  ${tw`py-2 text-xl font-semibold`}
`
const LogoWrapper = styled.div`
  ${tw`md:max-w-xs`}
`

export default Invalid
