import { Card } from "components/ui/Card"
import { Logo } from "components/ui/Logo"
import { NextPage } from "next"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import tw from "twin.macro"

const Invalid: NextPage = () => {
  const { t } = useTranslation()

  return (
    <Base>
      <Container>
        <Wrapper>
          <Logo
            logoUrl="https://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo1.png"
            companyName="Test company"
            tw="pt-10 mb-10 pl-4"
          />
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
