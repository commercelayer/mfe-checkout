import {
  PaymentSetting,
  PaymentSettingGiftCard,
  PaymentSettingGiftCardList,
  PaymentSettingGiftCardListItem,
  PaymentSettingInstrument,
  PaymentSettingName,
  PaymentSource,
  PaymentSourceBrandIcon,
  PaymentSourceBrandName,
  PaymentSourceDetail,
} from "@commercelayer/react-components"
import { OrderSummary } from "components/composite/OrderSummary"
import { AppContext } from "components/data/AppProvider"
import { Base } from "components/ui/Base"
import { Button } from "components/ui/Button"
import { CustomAddress } from "components/ui/CustomerAddressCard"
import { FlexContainer } from "components/ui/FlexContainer"
import { Footer } from "components/ui/Footer"
import { Logo } from "components/ui/Logo"
import { getTranslations } from "components/utils/payments"
import { useContext, useEffect, useRef } from "react"
import { Trans, useTranslation } from "react-i18next"

import { CheckIcon } from "./CheckIcon"
import { SupportMessage } from "./SupportMessage"
import {
  AddressContainer,
  Bottom,
  Main,
  Recap,
  RecapBox,
  RecapCol,
  RecapCustomer,
  RecapItem,
  RecapItemDescription,
  RecapItemTitle,
  RecapSummary,
  RecapTitle,
  Text,
  Title,
  Top,
  Wrapper,
  WrapperButton,
} from "./styled"

interface Props {
  logoUrl: NullableType<string>
  companyName: string
  supportEmail: NullableType<string>
  supportPhone: NullableType<string>
  thankyouPageUrl: NullableType<string>
  orderNumber: string
}

// The `<1/>` in `stepPayment.endingIn` is self-closing, so `<Trans>` clones
// whatever sits in that slot without its children. The digits therefore have
// to come in as a prop of something that renders them itself — the role
// `<PaymentSourceDetail>` plays in the older model's recap.
const LastDigits: React.FC<{ digits: string }> = ({ digits }) => (
  <span className="ml-1 font-normal">{digits}</span>
)

export const StepComplete: React.FC<Props> = ({
  logoUrl,
  companyName,
  supportEmail,
  supportPhone,
  orderNumber,
  thankyouPageUrl = null,
}) => {
  const { t } = useTranslation()

  const ctx = useContext(AppContext)
  const topRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (thankyouPageUrl != null) {
      window.location.href = thankyouPageUrl
    }
  }, [thankyouPageUrl])

  useEffect(() => {
    if (topRef.current != null) {
      topRef.current.scrollIntoView({
        behavior: "smooth",
      })
    }
  }, [topRef.current])

  if (!ctx) return null

  const handleClick = () => {
    if (ctx?.returnUrl) {
      document.location.href = ctx?.returnUrl
    }
  }

  return (
    thankyouPageUrl == null && (
      <Base>
        <Top ref={topRef}>
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
              <Text
                data-testid="complete-checkout-summary"
                className="text-gray-400"
              >
                <Trans
                  i18nKey={"stepComplete.description"}
                  values={{ orderNumber }}
                  components={{
                    WrapperOrderId: <strong className="text-black" />,
                  }}
                />
              </Text>
              <SupportMessage
                supportEmail={supportEmail}
                supportPhone={supportPhone}
              />

              {ctx?.returnUrl && (
                <WrapperButton>
                  <Button
                    data-testid="button-continue-to-shop"
                    onClick={handleClick}
                  >
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
                <RecapTitle>{t("stepComplete.summary_title")}</RecapTitle>
                <OrderSummary appCtx={ctx} readonly />
              </RecapSummary>
              <RecapCustomer>
                <RecapTitle>{t("stepComplete.customer_title")}</RecapTitle>
                <RecapCol>
                  <RecapItemTitle>{t("stepComplete.email")}</RecapItemTitle>
                  <RecapItem>{ctx.emailAddress}</RecapItem>
                </RecapCol>
                <RecapCol>
                  <AddressContainer className="lg:grid-cols-1! xl:grid-cols-2!">
                    <div data-testid="billing-address-recap">
                      <RecapItemTitle>
                        {t("stepComplete.billed_to")}
                      </RecapItemTitle>
                      <RecapBox>
                        <CustomAddress
                          firstName={ctx.billingAddress?.first_name ?? ""}
                          lastName={ctx.billingAddress?.last_name ?? ""}
                          city={ctx.billingAddress?.city ?? ""}
                          line1={ctx.billingAddress?.line_1 ?? ""}
                          line2={ctx.billingAddress?.line_2 ?? ""}
                          zipCode={ctx.billingAddress?.zip_code ?? ""}
                          stateCode={ctx.billingAddress?.state_code ?? ""}
                          countryCode={ctx.billingAddress?.country_code ?? ""}
                          phone={ctx.billingAddress?.phone ?? ""}
                          addressType="billing"
                        />
                      </RecapBox>
                    </div>
                    <>
                      {ctx.isShipmentRequired && (
                        <div data-testid="shipping-address-recap">
                          <RecapItemTitle>
                            {t("stepComplete.ship_to")}
                          </RecapItemTitle>
                          <RecapBox>
                            <CustomAddress
                              firstName={ctx.shippingAddress?.first_name ?? ""}
                              lastName={ctx.shippingAddress?.last_name ?? ""}
                              city={ctx.shippingAddress?.city ?? ""}
                              line1={ctx.shippingAddress?.line_1 ?? ""}
                              line2={ctx.shippingAddress?.line_2 ?? ""}
                              zipCode={ctx.shippingAddress?.zip_code ?? ""}
                              stateCode={ctx.shippingAddress?.state_code ?? ""}
                              countryCode={
                                ctx.shippingAddress?.country_code ?? ""
                              }
                              phone={ctx.shippingAddress?.phone ?? ""}
                              addressType="shipping"
                            />
                          </RecapBox>
                        </div>
                      )}
                    </>
                  </AddressContainer>
                </RecapCol>

                <RecapCol data-testid="payment-recap">
                  <RecapItemTitle>{t("stepComplete.payment")}</RecapItemTitle>
                  {ctx.isPaymentRequired ? (
                    <RecapBox>
                      {/* One row per Payment Session, with what it paid, so the
                          amounts line up and add up to the total: the method
                          first, then the gift cards. A table rather than flex
                          rows because the amounts have to share a column.

                          The method row names what was charged — the card
                          with its last digits, or PayPal, Klarna — never the
                          account email. A setting with nothing to describe,
                          such as a manual payment, falls back to its name. The
                          instrument is known once the payment is authorized,
                          which a placed order is. No icon where the set has no
                          artwork: a broken image is worse than none.

                          A gift card shows only its last four characters: the
                          code is spendable, and the receipt is not the place to
                          repeat it.

                          Both payment models are rendered together; each
                          library tree steps aside when the order is not on its
                          own model, so there is no conditional to keep in sync
                          — the same arrangement as the payment step. */}
                      <table className="w-full text-md">
                        <tbody>
                          <PaymentSetting readonly>
                            {({ currentPaymentSession }) => (
                              <tr>
                                <td className="py-1 font-bold">
                                  <PaymentSettingInstrument
                                    fallback={<PaymentSettingName />}
                                  >
                                    {({
                                      isCard,
                                      brandName,
                                      cardLastDigits,
                                      iconUrl,
                                      label,
                                    }) => (
                                      <span
                                        className="flex items-center"
                                        data-testid="payment-instrument"
                                      >
                                        {iconUrl != null && (
                                          // biome-ignore lint/performance/noImgElement: static build, cannot use Image
                                          <img
                                            src={iconUrl}
                                            width={32}
                                            alt=""
                                            className="mr-2"
                                          />
                                        )}
                                        {isCard &&
                                        brandName != null &&
                                        cardLastDigits != null ? (
                                          <Trans i18nKey="stepPayment.endingIn">
                                            {brandName}
                                            <LastDigits
                                              digits={cardLastDigits}
                                            />
                                          </Trans>
                                        ) : (
                                          label
                                        )}
                                      </span>
                                    )}
                                  </PaymentSettingInstrument>
                                </td>
                                <td className="py-1 pl-4 text-right whitespace-nowrap">
                                  {currentPaymentSession?.formatted_amount}
                                </td>
                              </tr>
                            )}
                          </PaymentSetting>
                          <PaymentSettingGiftCard readonly>
                            <PaymentSettingGiftCardList>
                              <PaymentSettingGiftCardListItem>
                                {({ code, formattedAmount }) => (
                                  <tr data-testid="gift-card-recap">
                                    <td className="py-1 font-bold">
                                      <span className="flex items-center">
                                        <Trans i18nKey="stepPayment.endingIn">
                                          {t("orderRecap.giftcard_amount")}
                                          <LastDigits
                                            digits={(code ?? "").slice(-4)}
                                          />
                                        </Trans>
                                      </span>
                                    </td>
                                    <td className="py-1 pl-4 text-right whitespace-nowrap">
                                      {formattedAmount}
                                    </td>
                                  </tr>
                                )}
                              </PaymentSettingGiftCardListItem>
                            </PaymentSettingGiftCardList>
                          </PaymentSettingGiftCard>
                        </tbody>
                      </table>
                      <FlexContainer className="font-bold text-md">
                        <PaymentSource readonly>
                          <PaymentSourceBrandIcon className="mr-2" />
                          <PaymentSourceBrandName className="mr-1">
                            {({ brand }) => {
                              if (ctx.isCreditCard) {
                                return (
                                  <Trans i18nKey="stepPayment.endingIn">
                                    {brand}
                                    <PaymentSourceDetail
                                      className="ml-1 font-normal"
                                      type="last4"
                                    />
                                  </Trans>
                                )
                              }
                              return <>{getTranslations(brand, t)}</>
                            }}
                          </PaymentSourceBrandName>
                        </PaymentSource>
                      </FlexContainer>
                    </RecapBox>
                  ) : (
                    <RecapItemDescription>
                      {t("stepComplete.free_payment")}
                    </RecapItemDescription>
                  )}
                </RecapCol>
              </RecapCustomer>
            </Recap>
            <Footer />
          </Wrapper>
        </Bottom>
      </Base>
    )
  )
}
