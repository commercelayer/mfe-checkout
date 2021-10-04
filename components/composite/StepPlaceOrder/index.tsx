import { PlaceOrderContainer } from "@commercelayer/react-components"
import { ErrorComponentProps } from "@commercelayer/react-components/dist/typings/errors"
import { useRouter } from "next/router"
import { useContext, useState } from "react"
import { Trans, useTranslation } from "react-i18next"

import { AppContext } from "components/data/AppProvider"
import { GTMContext } from "components/data/GTMProvider"
import { ButtonWrapper } from "components/ui/Button"
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
  CheckboxWrapper,
} from "./styled"

interface Props {
  isActive: boolean
  termsUrl: string
  privacyUrl: string
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

  const { refetchOrder } = appCtx

  const messages: ErrorComponentProps["messages"] = [
    {
      code: "VALIDATION_ERROR",
      resource: "order",
      field: "status",
      message: t("error.transition"),
    },
    {
      code: "VALIDATION_ERROR",
      resource: "order",
      field: "paymentMethod",
      message: t("error.paymentMethod"),
    },
    {
      code: "VALIDATION_ERROR",
      resource: "order",
      field: "giftCardOrCouponCode",
      message: " ",
    },
    {
      code: "PAYMENT_NOT_APPROVED_FOR_EXECUTION",
      resource: "order",
      field: "base",
      message: t("error.payer"),
    },
    {
      code: "INVALID_RESOURCE_ID",
      resource: "order",
      field: "base",
      message: t("error.resourceID"),
    },
    {
      code: "EMPTY_ERROR",
      resource: "order",
      field: "customer_email",
      message: " ",
    },
  ]

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true)
    if (gtmCtx?.firePurchase && gtmCtx?.fireAddPaymentInfo) {
      gtmCtx.fireAddPaymentInfo()
      gtmCtx.firePurchase()
    }
    await refetchOrder()
    setIsPlacingOrder(false)
  }

  return (
    <>
      <ErrorsContainer>
        <StyledErrors resource="order" messages={messages}>
          {(props) => {
            if (props.errors.length === 0) {
              return null
            }
            return props.errors.map((error, index) => {
              if (error.trim().length === 0) {
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
            <FlexContainer className="items-start mx-5 mt-4 mb-2.5 md:mb-5 md:pb-5 md:mx-0 md:mt-0 md:border-b lg:pl-8 xl:items-center">
              <CheckboxWrapper>
                <StyledPrivacyAndTermsCheckbox
                  id="privacy-terms"
                  className="form-checkbox"
                  data-cy="checkbox-privacy-and-terms"
                />
              </CheckboxWrapper>
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
          <ButtonWrapper>
            <StyledPlaceOrderButton
              data-cy="place-order-button"
              isActive={isActive}
              onClick={handlePlaceOrder}
              label={
                <>
                  {isPlacingOrder && <SpinnerIcon />}
                  {t("stepPayment.submit")}
                </>
              }
            />
          </ButtonWrapper>
        </>
      </PlaceOrderContainer>
    </>
  )
}

export default StepPlaceOrder
