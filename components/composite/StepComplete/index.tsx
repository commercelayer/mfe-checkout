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
import { FlexContainer } from "components/ui/FlexContainer"
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
              <RecapTitle>Summary</RecapTitle>
              <OrderSummary appCtx={ctx} readonly />
            </RecapSummary>
            <RecapCustomer>
              <RecapTitle>Customer</RecapTitle>
              <RecapCol>
                <RecapItemTitle>E-mail:</RecapItemTitle>
                <RecapItem>{ctx.emailAddress}</RecapItem>
              </RecapCol>
              <RecapCol>
                <AddressContainer className="lg:!grid-cols-1 xl:!grid-cols-2">
                  <div>
                    <RecapItemTitle>Billed to:</RecapItemTitle>
                    <RecapBox>
                      <CustomAddress
                        firstName={ctx.billingAddress?.first_name}
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
                    </RecapBox>
                  </div>
                  <div>
                    <RecapItemTitle>Shipped to:</RecapItemTitle>
                    <RecapBox>
                      <CustomAddress
                        firstName={ctx.shippingAddress?.first_name}
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
                    </RecapBox>
                  </div>
                </AddressContainer>
              </RecapCol>
              <RecapCol>
                <RecapItemTitle>Payment:</RecapItemTitle>
                <RecapBox>
                  <FlexContainer className="font-bold text-md">
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
                                    className="ml-1 font-normal"
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
                  </FlexContainer>
                </RecapBox>
              </RecapCol>
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
  ${tw`flex flex-col justify-center items-center text-center`}
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
  ${tw`grid md:(auto-cols-fr grid-flow-col gap-16) lg:gap-32`}
`
const RecapSummary = styled.div`
  ${tw`order-last border-t border-dashed border-t-2 pt-6 md:(order-first border-0 p-0)`}
`
const RecapCustomer = styled.div`
  ${tw`order-1 md:order-2 mb-5 md:mb-0`}
`
const RecapTitle = styled.h2`
  ${tw`text-lg font-semibold leading-none mb-8 md:mb-16`}
`
const RecapCol = styled.div`
  ${tw`mb-4 md:mb-8`}
`
const RecapItemTitle = styled.h3`
  ${tw`font-normal text-sm mb-2`}
`
const RecapItem = styled.p`
  ${tw`text-md font-bold`}
`
const RecapBox = styled.div`
  ${tw`p-3 rounded border`}
`
const AddressContainer = styled(FlexContainer)`
  ${tw`flex-col gap-y-4 xl:(flex-row gap-4 justify-between)`}
  > div {
    ${tw`flex-1`}
  }
`
