import humanizeString from "humanize-string"
import { NextPage } from "next"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import titleize from "titleize"
import tw from "twin.macro"

import { Card } from "components/ui/Card"

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
    <Base>
      <Container>
        <Wrapper>
          <Text tw="text-center text-lg font-bold pt-10 mb-10 pl-4">
            {title}
          </Text>
          <Card>
            <Text data-cy="invalid-checkout" tw="py-5 h-44 text-center">
              {t("general.invalid")}
            </Text>
          </Card>
        </Wrapper>
      </Container>
    </Base>
  )
}

const Base = styled.div`
  ${tw`bg-gray-100 min-h-screen`}
`
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
