import type { Order } from "@commercelayer/sdk"
import { useContext, useState } from "react"
import { Trans, useTranslation } from "react-i18next"

import { AppContext } from "components/data/AppProvider"
import { GTMContext } from "components/data/GTMProvider"
import { FlexContainer } from "components/ui/FlexContainer"
import { Label } from "components/ui/Label"
import { SpinnerIcon } from "components/ui/SpinnerIcon"

import { ErrorIcon } from "./ErrorIcon"
import { messages } from "./messages"
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

  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const appCtx = useContext(AppContext)
  const gtmCtx = useContext(GTMContext)

  if (!appCtx) {
    return null
  }

  const { placeOrder } = appCtx

  const handlePlaceOrder = async ({
    placed,
    order,
  }: {
    placed: boolean
    order?: Order
  }) => {
    if (placed) {
      setIsPlacingOrder(true)
      await placeOrder(order)
      if (gtmCtx?.firePurchase && gtmCtx?.fireAddPaymentInfo) {
        await gtmCtx.fireAddPaymentInfo()
        await gtmCtx.firePurchase()
      }
      setIsPlacingOrder(false)
    }
  }

  return (
    <>
      <ErrorsContainer data-testid="errors-container">
        <StyledErrors
          resource="orders"
          messages={
            messages &&
            messages.map((msg) => {
              return { ...msg, message: t(msg.message) }
            })
          }
        >
          {(props) => {
            if (props.errors?.length === 0) {
              return null
            }
            const compactedErrors = props.errors
            return (
              <>
                {compactedErrors?.map((error, index) => {
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
                })}
              </>
            )
          }}
        </StyledErrors>
      </ErrorsContainer>

      <>
        {!!termsUrl && !!privacyUrl && (
          <FlexContainer className="items-start mx-5 mt-4 mb-2.5 md:mb-5 md:pb-5 md:mx-0 md:mt-0 md:border-b lg:pl-8">
            <StyledPrivacyAndTermsCheckbox
              id="privacy-terms"
              className="relative form-checkbox top-0.5"
              data-testid="checkbox-privacy-and-terms"
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
        <PlaceOrderButtonWrapper className="btn-background">
          <StyledPlaceOrderButton
            data-testid="save-payment-button"
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
    </>
  )
}

export default StepPlaceOrder
