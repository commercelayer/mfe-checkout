import { useContext } from "react"
import { useTranslation, Trans } from "react-i18next"
import styled from "styled-components"
import tw from "twin.macro"

import { AppContext } from "components/data/AppProvider"
import { Base } from "components/ui/Base"
import { Button } from "components/ui/Button"
import { Container } from "components/ui/Container"
import { Footer } from "components/ui/Footer"
import { Logo } from "components/ui/Logo"

import { CheckIcon } from "./CheckIcon"
import { SupportMessage } from "./SupportMessage"

interface Props {
  logoUrl: string
  companyName: string
  supportEmail: string
  supportPhone: string
  termsUrl: string
  privacyUrl: string
}

export const StepComplete: React.FC<Props> = ({
  logoUrl,
  companyName,
  supportEmail,
  supportPhone,
  termsUrl,
  privacyUrl,
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
          <Main>
            <div className="border border-gray-900">
              <CheckIcon />
            </div>
            <Title>{t("stepComplete.title")}</Title>
            <Text data-cy="complete-checkout-summary" tw="text-gray-500">
              <Trans
                i18nKey={"stepComplete.summary"}
                values={{ orderId: ctx?.orderId }}
                components={{
                  WrapperOrderId: <strong />,
                }}
              />
            </Text>
            <Message>
              <SupportMessage
                supportEmail={supportEmail}
                supportPhone={supportPhone}
              />
            </Message>
            {ctx?.returnUrl && (
              <WrapperButton>
                <Button data-cy="button-continue-to-shop" onClick={handleClick}>
                  {t("stepComplete.continue")}
                </Button>
              </WrapperButton>
            )}
          </Main>
          <Footer termsUrl={termsUrl} privacyUrl={privacyUrl} />
        </Wrapper>
      </Container>
    </Base>
  )
}

const Main = styled.div`
  ${tw`flex flex-col flex-1 justify-center items-center text-center`}
`
const Wrapper = styled.div`
  ${tw`flex flex-wrap justify-end items-stretch flex-col h-screen p-10 lg:px-20 lg:pb-10`}
`
const Title = styled.h1`
  ${tw`text-2xl lg:text-4xl font-semibold mb-4`}
`
const Text = styled.p`
  ${tw`py-2`}
`
const Message = styled.div`
  ${tw`my-8 text-gray-500`}
`
const WrapperButton = styled.div`
  ${tw`flex items-center justify-center pt-5`}
`
