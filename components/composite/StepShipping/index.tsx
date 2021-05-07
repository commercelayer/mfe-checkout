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
  ShippingMethodRadioButton,
  ShippingMethodPrice,
  LineItemsContainer,
  StockTransfer,
  StockTransferField,
  DeliveryLeadTime,
} from "@commercelayer/react-components"
import { useTranslation, Trans } from "next-i18next"
import { useContext, useState, useEffect } from "react"

import {
  StepSummary,
  StepSummaryItem,
  StepSummaryItemDescription,
  StepSummaryItemValue,
} from "../styled/StepSummary"

import { AppContext } from "components/data/AppProvider"
import { GTMContext } from "components/data/GTMProvider"
import { Button, ButtonWrapper } from "components/ui/Button"
import { StepContainer } from "components/ui/StepContainer"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"
import { StepLine } from "components/ui/StepLine"

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
} from "./styled"

interface Props {
  className?: string
  isActive?: boolean
  onToggleActive: () => void
}

export const StepShipping: React.FC<Props> = ({
  className,
  isActive,
  onToggleActive,
}) => {
  const appCtx = useContext(AppContext)
  const gtmCtx = useContext(GTMContext)

  const { t } = useTranslation()

  if (!appCtx || !appCtx.hasShippingAddress) {
    return null
  }

  const {
    shipments,
    hasShippingMethod,
    isShipmentRequired,
    refetchOrder,
  } = appCtx

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
    <StepContainer>
      <StepLine />
      <StepContent>
        <StepHeader
          stepNumber={2}
          status={isActive ? "edit" : "done"}
          label={t("stepShipping.title")}
          info={
            isShipmentRequired
              ? isActive
                ? t("stepShipping.summary")
                : t("stepShipping.methodSelected")
              : t("stepShipping.notRequired")
          }
          onEditRequest={() => {
            onToggleActive()
          }}
        />
        {isShipmentRequired && (
          <div>
            {isActive ? (
              <ShipmentsContainer>
                <Shipment>
                  <ShippingWrapper>
                    <ShippingTitle>Shipment #1</ShippingTitle>
                    <ShippingMethod>
                      <ShippingSummary>
                        <ShippingMethodRadioButton
                          data-cy="shipping-method-button"
                          onChange={(
                            shippingMethod:
                              | ShippingMethodCollection
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
                            className="p-1 border rounded"
                            width={50}
                          />
                          <ShippingLineItemDescription>
                            <ShippingLineItemTitle>
                              <LineItemName data-cy="line-item-name" />
                            </ShippingLineItemTitle>
                            <ShippingLineItemQty>
                              Quantity:{" "}
                              <LineItemQuantity
                                readonly
                                data-cy="line-item-quantity"
                                max={100}
                              />
                            </ShippingLineItemQty>
                          </ShippingLineItemDescription>
                        </ShippingLineItem>
                        <div>
                          <StockTransfer>
                            <div
                              className="flex flex-row"
                              data-cy="stock-transfer"
                            >
                              <StockTransferField
                                className="px-1"
                                type="quantity"
                              />{" "}
                              of <LineItemQuantity readonly className="px-1" />
                              items will undergo a transfer
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
                    {isLocalLoader && "spinner "}
                    {t("stepShipping.continueToPayment")}
                  </Button>
                </ButtonWrapper>
              </ShipmentsContainer>
            ) : hasShippingMethod ? (
              <ShipmentsContainer>
                <Shipment>
                  <ShippingMethod readonly>
                    <StepSummary>
                      <StepSummaryItem>
                        <ShippingMethodName data-cy="shipping-method-name-recap" />
                        <StepSummaryItemDescription>
                          <Trans t={t} i18nKey="stepShipping.deliveryLeadTime">
                            <DeliveryLeadTime type="minDays" />
                            <DeliveryLeadTime type="maxDays" className="mr-1" />
                          </Trans>
                        </StepSummaryItemDescription>
                      </StepSummaryItem>
                      <StepSummaryItemValue>
                        <ShippingMethodPrice
                          labelFreeOver={t("general.free")}
                        />
                      </StepSummaryItemValue>
                    </StepSummary>
                  </ShippingMethod>
                </Shipment>
              </ShipmentsContainer>
            ) : (
              <div>{t("stepShipping.methodUnselected")}</div>
            )}
          </div>
        )}
      </StepContent>
    </StepContainer>
  )
}
