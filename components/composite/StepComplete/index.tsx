import { useContext } from "react"
import { useTranslation, Trans } from "react-i18next"
import styled from "styled-components"
import tw from "twin.macro"

import { AppContext } from "components/data/AppProvider"
import { Base } from "components/ui/Base"
import { Button } from "components/ui/Button"
import { Card } from "components/ui/Card"
import { Logo } from "components/ui/Logo"

import { SupportMessage } from "./SupportMessage"

interface Props {
  logoUrl: string
  companyName: string
  supportEmail: string
  supportPhone: string
}

export const StepComplete: React.FC<Props> = ({
  logoUrl,
  companyName,
  supportEmail,
  supportPhone,
}) => {
  const { t } = useTranslation()

  const ctx = useContext(AppContext)

  const handleClick = () => {
    return ctx?.returnUrl && (document.location.href = ctx?.returnUrl)
  }

  return (
    <Base>
      <Container>
        <Wrapper>
          <Logo
            logoUrl={logoUrl}
            companyName={companyName}
            tw="pt-10 mb-10 pl-4"
          />
          <Card>
            <Text>{t("stepComplete.title")}</Text>
            <Text
              data-cy="complete-checkout-summary"
              tw="py-5 h-20 text-center"
            >
              <Trans
                i18nKey={"stepComplete.summary"}
                values={{ orderId: ctx?.orderId }}
                components={{
                  WrapperOrderId: <strong />,
                }}
              />
            </Text>
            <Text>
              <SupportMessage
                supportEmail={supportEmail}
                supportPhone={supportPhone}
              />
            </Text>
            {ctx?.returnUrl && (
              <WrapperButton>
                <Button data-cy="button-continue-to-shop" onClick={handleClick}>
                  {t("stepComplete.continue")}
                </Button>
              </WrapperButton>
            )}
          </Card>
        </Wrapper>
      </Container>
    </Base>
  )
}

const Container = styled.div`
  ${tw`flex items-center justify-center`}
`

const Wrapper = styled.div`
  ${tw`flex-1 max-w-screen-sm	items-center justify-center`}
`

const Text = styled.p`
  ${tw`py-2 h-20 text-center`}
`

const WrapperButton = styled.div`
  ${tw`flex items-center justify-center pt-5`}
`
