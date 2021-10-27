import { ShippingMethodCollection } from "@commercelayer/js-sdk"
import {
  LineItem,
  Shipment,
  ShipmentsContainer,
  LineItemImage,
  LineItemName,
  LineItemQuantity,
  ShippingMethodName,
  ShippingMethod,
  ShippingMethodPrice,
  LineItemsContainer,
  StockTransfer,
  StockTransferField,
  DeliveryLeadTime,
  ShipmentField,
} from "@commercelayer/react-components"
import classNames from "classnames"
import { useTranslation, Trans } from "next-i18next"
import { useContext, useState, useEffect } from "react"

import { AccordionContext } from "components/data/AccordionProvider"
import { AppContext } from "components/data/AppProvider"
import { GTMContext } from "components/data/GTMProvider"
import { Button, ButtonWrapper } from "components/ui/Button"
import { SpinnerIcon } from "components/ui/SpinnerIcon"
import { StepContainer } from "components/ui/StepContainer"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"

import {
  ShippingWrapper,
  ShippingTitle,
  ShippingSummary,
  ShippingSummaryItem,
  ShippingSummaryItemDescription,
  ShippingSummaryValue,
  ShippingLineItem,
  ShippingLineItemDescription,
  ShippingLineItemTitle,
  ShippingLineItemQty,
  StyledShippingMethodRadioButton,
} from "./styled"

interface Props {
  className?: string
  step: number
}

interface HeaderProps {
  className?: string
  step: number
  info?: string
}

export const StepHeaderShipping: React.FC<HeaderProps> = ({ step }) => {
  const appCtx = useContext(AppContext)
  const accordionCtx = useContext(AccordionContext)

  if (!appCtx || !accordionCtx) {
    return null
  }
  const { t } = useTranslation()
  const { hasShippingMethod, isShipmentRequired, shipments } = appCtx

  const recapText = () => {
    if (!isShipmentRequired) {
      return t("stepShipping.notRequired")
    }
    if (hasShippingMethod && accordionCtx.status !== "edit") {
      if (shipments.length === 1 && shipments[0]?.shippingMethodName) {
        return shipments[0]?.shippingMethodName
      }
      return t("stepShipping.methodSelected", { count: shipments.length })
    } else {
      return t("stepShipping.methodUnselected")
    }
  }

  return (
    <StepHeader
      stepNumber={step}
      status={accordionCtx.status}
      label={t("stepShipping.title")}
      info={recapText()}
      onEditRequest={isShipmentRequired ? accordionCtx.setStep : undefined}
    />
  )
}

export const StepShipping: React.FC<Props> = () => {
  const appCtx = useContext(AppContext)
  const accordionCtx = useContext(AccordionContext)
  const gtmCtx = useContext(GTMContext)

  const { t } = useTranslation()

  if (!appCtx || !accordionCtx) {
    return null
  }

  const { shipments, isShipmentRequired, refetchOrder } = appCtx

  const [shipmentsSelected, setShipmentsSelected] = useState(shipments)
  const [canContinue, setCanContinue] = useState(false)
  const [isLocalLoader, setIsLocalLoader] = useState(false)

  useEffect(() => {
    setCanContinue(
      !shipmentsSelected?.map((s) => s.shippingMethodId).includes(undefined)
    )
  }, [shipmentsSelected])

  useEffect(() => {
    setShipmentsSelected(shipments)
  }, [shipments])

  const handleChange = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    shippingMethod: ShippingMethodCollection | Record<string, any>
  ): void => {
    setShipmentsSelected((shipmentsSelected) =>
      shipmentsSelected?.map((shipment) => {
        return shipment.shipmentId === shippingMethod.shipmentId
          ? {
              ...shipment,
              shippingMethodId: shippingMethod.id,
            }
          : shipment
      })
    )
  }

  const handleSave = async () => {
    setIsLocalLoader(true)
    await refetchOrder()
    setIsLocalLoader(false)
    if (gtmCtx?.fireAddShippingInfo) {
      gtmCtx.fireAddShippingInfo()
    }
  }

  return (
    <StepContainer
      className={classNames({
        current: accordionCtx.isActive,
        done: !accordionCtx.isActive,
        submitting: isLocalLoader,
      })}
    >
      <StepContent>
        {isShipmentRequired && (
          <div>
            {accordionCtx.isActive && (
              <ShipmentsContainer>
                <Shipment
                  loader={
                    <div className="animate-pulse">
                      <div className="w-1/2 h-5 bg-gray-200" />
                      <div className="h-20 my-5 bg-gray-200" />
                    </div>
                  }
                >
                  <ShippingWrapper>
                    <ShippingTitle>
                      {shipments.length > 1 && (
                        <Trans t={t} i18nKey="stepShipping.shipment">
                          <ShipmentField name="keyNumber" />
                        </Trans>
                      )}
                    </ShippingTitle>
                    <ShippingMethod emptyText={t("stepShipping.notAvaible")}>
                      <ShippingSummary>
                        <StyledShippingMethodRadioButton
                          className="form-radio mt-0.5 md:mt-0"
                          data-cy="shipping-method-button"
                          onChange={(
                            shippingMethod:
                              | ShippingMethodCollection
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              | Record<string, any>
                          ) => handleChange(shippingMethod)}
                        />
                        <ShippingSummaryItem>
                          <ShippingMethodName data-cy="shipping-method-name" />
                          <ShippingSummaryItemDescription>
                            <Trans
                              t={t}
                              i18nKey="stepShipping.deliveryLeadTime"
                            >
                              <DeliveryLeadTime
                                type="minDays"
                                data-cy="delivery-lead-time-min-days"
                              />
                              <DeliveryLeadTime
                                type="maxDays"
                                data-cy="delivery-lead-time-max-days"
                                className="mr-1"
                              />
                            </Trans>
                          </ShippingSummaryItemDescription>
                        </ShippingSummaryItem>
                        <ShippingSummaryValue>
                          <ShippingMethodPrice
                            data-cy="shipping-method-price"
                            labelFreeOver={t("general.free")}
                          />
                        </ShippingSummaryValue>
                      </ShippingSummary>
                    </ShippingMethod>
                    <LineItemsContainer>
                      <LineItem>
                        <ShippingLineItem>
                          <LineItemImage
                            className="self-start p-1 border rounded"
                            width={50}
                          />
                          <ShippingLineItemDescription>
                            <ShippingLineItemTitle>
                              <LineItemName data-cy="line-item-name" />
                            </ShippingLineItemTitle>
                            <ShippingLineItemQty>
                              <LineItemQuantity
                                readonly
                                data-cy="line-item-quantity"
                                max={100}
                              >
                                {(props) =>
                                  !!props.quantity &&
                                  t("orderRecap.quantity", {
                                    count: props.quantity,
                                  })
                                }
                              </LineItemQuantity>
                            </ShippingLineItemQty>
                          </ShippingLineItemDescription>
                        </ShippingLineItem>
                        <div>
                          <StockTransfer>
                            <div
                              className="flex flex-row"
                              data-cy="stock-transfer"
                            >
                              <Trans t={t} i18nKey="stepShipping.stockTransfer">
                                <StockTransferField
                                  className="px-1"
                                  type="quantity"
                                />
                                <LineItemQuantity readonly className="px-1" />
                              </Trans>
                            </div>
                          </StockTransfer>
                        </div>
                      </LineItem>
                    </LineItemsContainer>
                  </ShippingWrapper>
                </Shipment>
                <ButtonWrapper>
                  <Button
                    disabled={!canContinue || isLocalLoader}
                    data-cy="save-shipments-button"
                    onClick={handleSave}
                  >
                    {isLocalLoader && <SpinnerIcon />}
                    {t("stepShipping.continueToPayment")}
                  </Button>
                </ButtonWrapper>
              </ShipmentsContainer>
            )}
          </div>
        )}
      </StepContent>
    </StepContainer>
  )
}
