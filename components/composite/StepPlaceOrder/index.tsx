import {
  PlaceOrderContainer,
  ErrorComponentProps,
} from "@commercelayer/react-components"
import { useRouter } from "next/router"
import { useContext, useState } from "react"
import { Trans, useTranslation } from "react-i18next"

import { AppContext } from "components/data/AppProvider"
import { GTMContext } from "components/data/GTMProvider"
import { FlexContainer } from "components/ui/FlexContainer"
import { Label } from "components/ui/Label"
import { SpinnerIcon } from "components/ui/SpinnerIcon"

import { ErrorIcon } from "./ErrorIcon"
import {
  ErrorIco,
  ErrorMessage,
  ErrorsContainer,
  ErrorWrapper,
  StyledErrors,
  StyledPlaceOrderButton,
  StyledPrivacyAndTermsCheckbox,
  PlaceOrderButtonWrapper,
} from "./styled"

interface Props {
  isActive: boolean
  termsUrl?: string
  privacyUrl?: string
}

const StepPlaceOrder: React.FC<Props> = ({
  isActive,
  termsUrl,
  privacyUrl,
}) => {
  const { t } = useTranslation()
  const { query } = useRouter()

  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const appCtx = useContext(AppContext)
  const gtmCtx = useContext(GTMContext)

  if (!appCtx) {
    return null
  }

  const { placeOrder } = appCtx

  const messages: ErrorComponentProps["messages"] = [
    {
      code: "VALIDATION_ERROR",
      resource: "orders",
      field: "status",
      message: t("error.transition"),
    },
    {
      code: "VALIDATION_ERROR",
      resource: "orders",
      field: "paymentMethod",
      message: t("error.paymentMethod"),
    },
    {
      code: "VALIDATION_ERROR",
      resource: "orders",
      field: "giftCardOrCouponCode",
      message: " ",
    },
    {
      code: "PAYMENT_NOT_APPROVED_FOR_EXECUTION",
      resource: "orders",
      field: "base",
      message: t("error.payer"),
    },
    {
      code: "INVALID_RESOURCE_ID",
      resource: "orders",
      field: "base",
      message: t("error.resourceID"),
    },
    {
      code: "EMPTY_ERROR",
      resource: "orders",
      field: "customer_email",
      message: " ",
    },
    {
      code: "VALIDATION_ERROR",
      resource: "orders",
      field: "customer_email",
      message: " ",
    },
  ]

  const handlePlaceOrder = async ({ placed }: { placed: boolean }) => {
    if (placed) {
      setIsPlacingOrder(true)
      await placeOrder()
      if (gtmCtx?.firePurchase && gtmCtx?.fireAddPaymentInfo) {
        await gtmCtx.fireAddPaymentInfo()
        await gtmCtx.firePurchase()
      }
      setIsPlacingOrder(false)
    }
  }

  return (
    <>
      <ErrorsContainer>
        <StyledErrors resource="orders" messages={messages}>
          {(props) => {
            if (props.errors?.length === 0) {
              return null
            }
            const compactedErrors = [...new Set(props.errors)]
            return compactedErrors?.map((error, index) => {
              if (error?.trim().length === 0 || !error) {
                return null
              }
              return (
                <ErrorWrapper key={index}>
                  <ErrorIco>
                    <ErrorIcon />
                  </ErrorIco>
                  <ErrorMessage>{error}</ErrorMessage>
                </ErrorWrapper>
              )
            })
          }}
        </StyledErrors>
      </ErrorsContainer>
      <PlaceOrderContainer
        options={{
          paypalPayerId: query?.PayerID as string,
        }}
      >
        <>
          {!!termsUrl && !!privacyUrl && (
            <FlexContainer className="items-start mx-5 mt-4 mb-2.5 md:mb-5 md:pb-5 md:mx-0 md:mt-0 md:border-b lg:pl-8">
              <StyledPrivacyAndTermsCheckbox
                id="privacy-terms"
                className="relative form-checkbox top-0.5"
                data-test-id="checkbox-privacy-and-terms"
              />
              <Label htmlFor="privacy-terms">
                <Trans
                  i18nKey="general.privacy_and_terms"
                  components={{
                    bold: <strong />,
                    termsUrl: (
                      <a href={termsUrl} target="_blank" rel="noreferrer" />
                    ),
                    privacyUrl: (
                      <a href={privacyUrl} target="_blank" rel="noreferrer" />
                    ),
                  }}
                />
              </Label>
            </FlexContainer>
          )}
          <PlaceOrderButtonWrapper>
            <StyledPlaceOrderButton
              data-test-id="save-payment-button"
              isActive={isActive}
              onClick={handlePlaceOrder}
              label={
                <>
                  {isPlacingOrder && <SpinnerIcon />}
                  {t("stepPayment.submit")}
                </>
              }
            />
          </PlaceOrderButtonWrapper>
        </>
      </PlaceOrderContainer>
    </>
  )
}

export default StepPlaceOrder
