import {
  PaymentSourceBrandName,
  PaymentSourceDetail,
  PlaceOrderContainer,
  PaymentSource,
  PaymentMethodsContainer,
  PaymentSourceBrandIcon,
  PrivacyAndTermsCheckbox,
} from "@commercelayer/react-components"
import "twin.macro"
import { ErrorComponentProps } from "@commercelayer/react-components/dist/typings/errors"
import classNames from "classnames"
import { useContext, useEffect, useState } from "react"
import { Trans, useTranslation } from "react-i18next"

import {
  StepSummary,
  StepSummaryItem,
  StepSummaryItemValue,
} from "../styled/StepSummary"

import { AppContext } from "components/data/AppProvider"
import { GTMContext } from "components/data/GTMProvider"
import useDeviceDetect from "components/hooks/useDeviceDetect"
import { Button, ButtonWrapper } from "components/ui/Button"
import { FlexContainer } from "components/ui/FlexContainer"
import { SpinnerIcon } from "components/ui/SpinnerIcon"
import { StepContainer } from "components/ui/StepContainer"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"
import { StepLine } from "components/ui/StepLine"

import { CheckoutCustomerPayment } from "./CheckoutCustomerPayment"
import { CheckoutPayment } from "./CheckoutPayment"
import { ErrorIcon } from "./ErrorIcon"
import {
  StyledPlaceOrderButton,
  StyledErrors,
  ErrorWrapper,
  ErrorMessage,
  ErrorIco,
  ErrorsContainer,
} from "./styled"

interface Props {
  className?: string
  isActive?: boolean
  onToggleActive: () => void
  step: number
  termsUrl: string
}

interface HeaderProps {
  className?: string
  isActive?: boolean
  onToggleActive?: () => void
  step: number
  status?: "done" | "edit" | "disabled"
  info?: string
}

export const StepHeaderPayment: React.FC<HeaderProps> = ({
  isActive,
  onToggleActive,
  step,
  status,
  info,
}) => {
  const { t } = useTranslation()
  return (
    <StepHeader
      stepNumber={step}
      status={status || isActive ? "edit" : "done"}
      label={t("stepPayment.title")}
      info={info || t("stepPayment.summary")}
      onEditRequest={
        onToggleActive
          ? () => {
              onToggleActive()
            }
          : undefined
      }
    />
  )
}

export const StepPayment: React.FC<Props> = ({
  isActive,
  termsUrl,
  onToggleActive,
}) => {
  const [canContinue, setCanContinue] = useState(false)
  const [isLocalLoader, setIsLocalLoader] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const { isMobile } = useDeviceDetect()
  const appCtx = useContext(AppContext)
  const gtmCtx = useContext(GTMContext)

  const { t } = useTranslation()

  // if (!appCtx || !appCtx.hasShippingMethod) {
  // this exit on shippingMethod is causing an error in useEffect to enable button
  if (!appCtx) {
    return null
  }

  const {
    hasPaymentMethod,
    paymentMethod,
    refetchOrder,
    isGuest,
    isPaymentRequired,
  } = appCtx

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
      field: "base",
      message: t("error.shipments"),
    },
    {
      code: "VALIDATION_ERROR",
      resource: "order",
      field: "giftCardOrCouponCode",
      message: " ",
    },
  ]

  const handleSave = async () => {
    setIsLocalLoader(true)
    if (gtmCtx?.fireAddPaymentInfo) {
      gtmCtx.fireAddPaymentInfo()
    }
    await refetchOrder()
    setIsLocalLoader(false)
  }

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true)
    if (gtmCtx?.firePurchase) {
      gtmCtx.firePurchase()
    }
    await refetchOrder()
    setIsPlacingOrder(false)
  }

  useEffect(() => {
    setCanContinue(!!hasPaymentMethod)
  }, [hasPaymentMethod])

  return (
    <>
      <StepContainer
        className={classNames({
          current: isActive,
          done: !isActive,
        })}
      >
        <StepLine stepNumber={3} status={isActive ? "edit" : "done"} />
        <StepContent>
          {!isMobile && (
            <StepHeaderPayment
              step={3}
              status={
                isActive ? "edit" : hasPaymentMethod ? "done" : "disabled"
              }
              info={
                isPaymentRequired
                  ? isActive
                    ? t("stepPayment.summary")
                    : hasPaymentMethod
                    ? t("stepPayment.methodSelected")
                    : t("stepPayment.methodUnselected")
                  : t("stepPayment.notRequired")
              }
              onToggleActive={onToggleActive}
            />
          )}
          {isPaymentRequired && (
            <div>
              {isActive ? (
                <>
                  {isGuest ? (
                    <CheckoutPayment handleSave={handleSave} />
                  ) : (
                    <CheckoutCustomerPayment handleSave={handleSave} />
                  )}
                  {hasPaymentMethod && (
                    <ButtonWrapper>
                      <Button
                        disabled={!canContinue}
                        data-cy="save-payment-button"
                        onClick={handleSave}
                      >
                        {isLocalLoader && <SpinnerIcon />}
                        {t("general.save")}
                      </Button>
                    </ButtonWrapper>
                  )}
                </>
              ) : (
                hasPaymentMethod && (
                  <>
                    <StepSummary>
                      <StepSummaryItem data-cy="payment-method-selected">
                        <PaymentMethodsContainer>
                          <PaymentSource readonly>
                            <PaymentSourceBrandIcon className="mr-2" />
                            <Trans t={t} i18nKey="stepPayment.endingIn">
                              <PaymentSourceBrandName className="mr-1" />
                              <PaymentSourceDetail
                                className="ml-1"
                                type="last4"
                              />
                            </Trans>
                          </PaymentSource>
                        </PaymentMethodsContainer>
                      </StepSummaryItem>
                      <StepSummaryItemValue data-cy="payment-method-price-selected">
                        {paymentMethod?.formattedPriceAmount}
                      </StepSummaryItemValue>
                    </StepSummary>
                  </>
                )
              )}
            </div>
          )}
        </StepContent>
      </StepContainer>
      {((isPaymentRequired && !isActive && hasPaymentMethod) ||
        !isPaymentRequired) && (
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
          <PlaceOrderContainer>
            {!!termsUrl && (
              <FlexContainer className="items-center">
                <PrivacyAndTermsCheckbox
                  id="privacy-terms"
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400 disabled:opacity-50"
                />
                <label
                  htmlFor="privacy-terms"
                  className="self-end block ml-3 text-sm text-gray-700"
                >
                  <Trans
                    i18nKey="general.privacy_and_terms"
                    components={{
                      bold: <strong />,
                      url: (
                        <a href={termsUrl} target="_blank" rel="noreferrer" />
                      ),
                    }}
                  />
                </label>
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
          </PlaceOrderContainer>
        </>
      )}
    </>
  )
}
