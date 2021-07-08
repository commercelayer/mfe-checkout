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
  termsUrl: string
  privacyUrl: string
}

const StepPlaceOrder: React.FC<Props> = ({ termsUrl, privacyUrl }) => {
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
  ]

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true)
    if (gtmCtx?.firePurchase) {
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
            if (!props.errors.length) {
              return null
            }
            return props.errors.map((error, index) => {
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
            <FlexContainer className="items-start pb-5 mb-5 border-b xl:items-center lg:pl-8">
              <CheckboxWrapper>
                <StyledPrivacyAndTermsCheckbox
                  id="privacy-terms"
                  className="form-checkbox"
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
