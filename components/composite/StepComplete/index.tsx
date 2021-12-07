import {
  PaymentSource,
  PaymentSourceBrandIcon,
  PaymentSourceBrandName,
  PaymentSourceDetail,
} from "@commercelayer/react-components"
import { useContext } from "react"
import { useTranslation, Trans } from "react-i18next"
import styled from "styled-components"
import tw from "twin.macro"

import { OrderSummary } from "components/composite/OrderSummary"
import { PaymentContainer } from "components/composite/StepPayment/PaymentContainer"
import { AppContext } from "components/data/AppProvider"
import { Base } from "components/ui/Base"
import { Button } from "components/ui/Button"
import { CustomAddress } from "components/ui/CustomerAddressCard"
import { Footer } from "components/ui/Footer"
import { Logo } from "components/ui/Logo"

import { CheckIcon } from "./CheckIcon"
import { SupportMessage } from "./SupportMessage"

interface Props {
  logoUrl?: string
  companyName: string
  supportEmail: string
  supportPhone: string
  orderNumber: number
}

export const StepComplete: React.FC<Props> = ({
  logoUrl,
  companyName,
  supportEmail,
  supportPhone,
  orderNumber,
}) => {
  const { t } = useTranslation()

  const ctx = useContext(AppContext)

  if (!ctx) return null

  const handleClick = () => {
    ctx?.returnUrl && (document.location.href = ctx?.returnUrl)
  }

  return (
    <Base>
      <Top>
        <Wrapper>
          <Logo
            logoUrl={logoUrl}
            companyName={companyName}
            className="self-center pt-10 pl-4 mb-10 md:self-auto"
          />
          <Main>
            <div className="p-8">
              <CheckIcon />
            </div>
            <Title>{t("stepComplete.title")}</Title>
            <Text data-cy="complete-checkout-summary" className="text-gray-500">
              <Trans
                i18nKey={"stepComplete.summary"}
                values={{ orderNumber: orderNumber }}
                components={{
                  WrapperOrderId: <strong className="text-black" />,
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

                {""}
              </WrapperButton>
            )}
          </Main>
        </Wrapper>
      </Top>
      <Bottom>
        <Wrapper>
          <Recap>
            <RecapSummary>
              <RecapSummary>Summary</RecapSummary>
              <OrderSummary appCtx={ctx} readonly />
            </RecapSummary>
            <RecapCustomer>
              Customer
              <div>{ctx.emailAddress}</div>
              <div className="flex flex-row">
                <CustomAddress
                  firstName={ctx.billingAddress?.name}
                  lastName={ctx.billingAddress?.last_name}
                  city={ctx.billingAddress?.city}
                  line1={ctx.billingAddress?.line_1}
                  line2={ctx.billingAddress?.line_2}
                  zipCode={ctx.billingAddress?.zip_code}
                  stateCode={ctx.billingAddress?.state_code}
                  countryCode={ctx.billingAddress?.country_code}
                  phone={ctx.billingAddress?.phone}
                  addressType="billing"
                />
                <CustomAddress
                  firstName={ctx.shippingAddress?.name}
                  lastName={ctx.shippingAddress?.last_name}
                  city={ctx.shippingAddress?.city}
                  line1={ctx.shippingAddress?.line_1}
                  line2={ctx.shippingAddress?.line_2}
                  zipCode={ctx.shippingAddress?.zip_code}
                  stateCode={ctx.shippingAddress?.state_code}
                  countryCode={ctx.shippingAddress?.country_code}
                  phone={ctx.shippingAddress?.phone}
                  addressType="shipping"
                />
              </div>
              <div className="flex">
                <PaymentContainer>
                  <PaymentSource readonly>
                    <PaymentSourceBrandIcon className="mr-2" />
                    <PaymentSourceBrandName className="mr-1">
                      {({ brand }) => {
                        console.log("dsa")
                        if (ctx.isCreditCard) {
                          return (
                            <Trans t={t} i18nKey="stepPayment.endingIn">
                              {brand}
                              <PaymentSourceDetail
                                className="ml-1"
                                type="last4"
                              />
                            </Trans>
                          )
                        }
                        return brand
                      }}
                    </PaymentSourceBrandName>
                  </PaymentSource>
                </PaymentContainer>
              </div>
            </RecapCustomer>
          </Recap>
          <Footer />
        </Wrapper>
      </Bottom>
    </Base>
  )
}

const Top = styled.div`
  ${tw`bg-white`}
`
const Bottom = styled.div`
  ${tw`bg-gray-100`}
`

const Main = styled.div`
  ${tw`flex flex-col flex-1 justify-center items-center text-center pb-8`}
`
const Wrapper = styled.div`
  ${tw`flex flex-col p-5 md:p-10 lg:px-20 2xl:(max-w-screen-2xl mx-auto)`}
`
const Title = styled.h1`
  ${tw`text-2xl lg:text-4xl font-semibold mb-4`}
`
const Text = styled.p`
  ${tw`py-2`}
`
const Message = styled.div`
  ${tw`my-8 text-gray-500`}
  > br {
    ${tw`hidden md:block`}
  }
`
const WrapperButton = styled.div`
  ${tw`flex items-center justify-center`}
`
const Recap = styled.div`
  ${tw`md:(grid auto-cols-fr grid-flow-col gap-4)`}
`
const RecapSummary = styled.div`
  ${tw``}
`
const RecapCustomer = styled.div`
  ${tw``}
`
