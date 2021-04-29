import * as S from "components/ui"
import humanizeString from "humanize-string"
import { NextPage } from "next"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import titleize from "titleize"
import tw from "twin.macro"

const Invalid: NextPage = () => {
  const { t } = useTranslation()
  const [title, setTitle] = useState("")

  useEffect(() => {
    if (window) {
      const humanizeHostname = titleize(
        humanizeString(window.location.hostname)
      )
      setTitle(humanizeHostname)
    }
  }, [])

  return (
    <S.Base>
      <Container>
        <Wrapper>
          <Text tw="text-center text-lg font-bold pt-10 mb-10 pl-4">
            {title}
          </Text>
          <S.Card>
            <Text data-cy="invalid-checkout" tw="py-5 h-44 text-center">
              {t("general.invalid")}
            </Text>
          </S.Card>
        </Wrapper>
      </Container>
    </S.Base>
  )
}

const Container = styled.div`
  ${tw`flex items-center justify-center`}
`
const Wrapper = styled.div`
  ${tw`flex-1 max-w-screen-sm	items-center justify-center`}
`
const Text = styled.p`
  ${tw`py-5 h-20 text-center`}
`

export default Invalid
