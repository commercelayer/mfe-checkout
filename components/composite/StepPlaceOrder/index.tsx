import { usePaymentGatewayHandoff } from "@commercelayer/react-components"
import type { Order } from "@commercelayer/sdk"
import { AppContext } from "components/data/AppProvider"
import { GTMContext } from "components/data/GTMProvider"
import { FlexContainer } from "components/ui/FlexContainer"
import { CheckCss } from "components/ui/form/CheckBox"
import { Label } from "components/ui/Label"
import { SpinnerIcon } from "components/ui/SpinnerIcon"
import { useContext, useId, useState } from "react"
import { Trans, useTranslation } from "react-i18next"
import { RepeatIcon } from "../OrderSummary/RepeatIcon"
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
} from "./styled"
import { WarningIcon } from "./WarningIcon"

interface Props {
  isActive: boolean
  termsUrl: NullableType<string>
  privacyUrl: NullableType<string>
}

const StepPlaceOrder: React.FC<Props> = ({
  isActive,
  termsUrl,
  privacyUrl,
}) => {
  const { t } = useTranslation()

  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  // Money has already been taken with nobody pressing this button — a 3DS
  // redirect coming back, or PayPal's own button — and the library is placing
  // the order on its own initiative. The terms are not asked for again:
  // acceptance happened before the payment, and asking now would leave anyone
  // who declines with a paid, unplaced order.
  const { collection, collectedOutOfBand } = usePaymentGatewayHandoff()
  const isResumingPayment =
    collectedOutOfBand === "in-progress" || collectedOutOfBand === "done"
  // The selected method carries its own pay button, and it is the only thing
  // that can open the popup. Ours would throw, so it says so instead.
  const collectsItself = collection?.by === "gateway"

  const privacyAndTermsId = useId()
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
        gtmCtx.fireAddPaymentInfo()
        gtmCtx.firePurchase()
      }
      setIsPlacingOrder(false)
    }
  }

  return (
    <>
      {appCtx.hasSubscriptions && isActive && (
        <div
          className={`text-gray-500 font-semibold p-4 m-5 mb-0 md:mb-5 md:mx-0 text-sm border border-dashed ${
            !appCtx.isGuest ? "" : "border-orange-400"
          }`}
        >
          {appCtx.isGuest ? (
            <div className="flex">
              <div className="relative w-4 mr-2 top-0.5">
                <WarningIcon />
              </div>
              <p>{t("stepPayment.subscriptionWithoutCustomer")}</p>
            </div>
          ) : (
            <div className="flex">
              <div className="relative w-4 mr-2 top-0.5">
                <RepeatIcon />
              </div>
              <p>{t("stepPayment.subscriptionWithCustomer")}</p>
            </div>
          )}
        </div>
      )}
      <ErrorsContainer data-testid="errors-container">
        <StyledErrors
          resource="orders"
          messages={messages?.map((msg) => {
            return { ...msg, message: t(msg.message) }
          })}
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
            {isResumingPayment ? (
              // Shown as given rather than wired to the library's store: the
              // acceptance itself did not survive the navigation, so the real
              // checkbox would render unchecked and read as if the shopper had
              // never agreed to anything.
              <input
                type="checkbox"
                checked
                disabled
                readOnly
                id={privacyAndTermsId}
                className={`${CheckCss} relative form-checkbox top-0.5`}
                data-testid="checkbox-privacy-and-terms"
              />
            ) : (
              <StyledPrivacyAndTermsCheckbox
                id={privacyAndTermsId}
                className="relative form-checkbox top-0.5"
                data-testid="checkbox-privacy-and-terms"
              />
            )}
            <Label htmlFor={privacyAndTermsId}>
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
        {collectsItself && !isResumingPayment && (
          <div
            className="mx-5 mb-2.5 text-sm text-gray-500 md:mx-0"
            data-testid="gateway-owns-button"
          >
            {t("stepPayment.useGatewayButton")}
          </div>
        )}
        <div className="place-order-button-wrapper ">
          <StyledPlaceOrderButton
            data-testid="save-payment-button"
            isActive={isActive}
            onClick={handlePlaceOrder}
            loadingLabel={t("stepPayment.submitting")}
            label={
              <>
                {(isPlacingOrder || isResumingPayment) && <SpinnerIcon />}
                {isResumingPayment
                  ? t("stepPayment.submitting")
                  : t("stepPayment.submit")}
              </>
            }
          />
        </div>
      </>
    </>
  )
}

export default StepPlaceOrder
