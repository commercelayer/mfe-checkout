import { AppContext } from "components/data/AppProvider"
import { Base } from "components/ui/Base"
import { Button } from "components/ui/Button"
import { Card } from "components/ui/Card"
import { Logo } from "components/ui/Logo"
import { useContext } from "react"
import { useTranslation, Trans } from "react-i18next"
import styled from "styled-components"
import tw from "twin.macro"

interface Props {
  logoUrl: string
  companyName: string
  redirectUrl: string
}

export const StepComplete: React.FC<Props> = ({
  logoUrl,
  companyName,
  redirectUrl,
}) => {
  const { t } = useTranslation()

  const ctx = useContext(AppContext)

  const emailSupport = "test@extendi.it"
  const phoneSupport = "+39 111 222 3333"

  const handleClick = () => {
    return (document.location.href = redirectUrl) || window.history.back()
  }

  const handleEmail = () => {
    return window.open(`mailto:${emailSupport}`)
  }

  const handlePhone = () => {
    return window.open(`tel:${emailSupport}`)
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
              {phoneSupport && emailSupport && (
                <Trans
                  i18nKey={"stepComplete.fullSupport"}
                  values={{ email: emailSupport, phone: phoneSupport }}
                  components={{
                    WrapperEmail: (
                      <strong tw="cursor-pointer" onClick={handleEmail} />
                    ),
                    WrapperPhone: (
                      <strong tw="cursor-pointer" onClick={handlePhone} />
                    ),
                  }}
                />
              )}
              {!phoneSupport && emailSupport && (
                <Trans
                  i18nKey={"stepComplete.emailSupport"}
                  values={{ email: emailSupport }}
                  components={{
                    WrapperEmail: (
                      <strong tw="cursor-pointer" onClick={handleEmail} />
                    ),
                  }}
                />
              )}
              {phoneSupport && !emailSupport && (
                <Trans
                  i18nKey={"stepComplete.phoneSupport"}
                  values={{ phone: phoneSupport }}
                  components={{
                    WrapperPhone: (
                      <strong tw="cursor-pointer" onClick={handlePhone} />
                    ),
                  }}
                />
              )}
            </Text>
            <WrapperButton>
              <Button data-cy="button-continue-to-shop" onClick={handleClick}>
                {t("stepComplete.continue")}
              </Button>
            </WrapperButton>
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
