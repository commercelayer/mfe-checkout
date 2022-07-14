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
  LineItemType,
  ErrorComponentProps,
} from "@commercelayer/react-components"
import { ShippingMethod as ShippingMethodCollection } from "@commercelayer/sdk"
import classNames from "classnames"
import { useTranslation, Trans } from "next-i18next"
import { useContext, useState, useEffect } from "react"

import { AccordionContext } from "components/data/AccordionProvider"
import { AppContext } from "components/data/AppProvider"
import { GTMContext } from "components/data/GTMProvider"
import { Button, ButtonWrapper } from "components/ui/Button"
import { GridContainer } from "components/ui/GridContainer"
import { SpinnerIcon } from "components/ui/SpinnerIcon"
import { StepContainer } from "components/ui/StepContainer"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"
import { LINE_ITEMS_SHIPPABLE } from "components/utils/constants"

import { NoShippingMethods } from "./Errors/NoShippingMethods"
import { OutOfStock } from "./Errors/OutOfStock"
import {
  ShippingWrapper,
  ShippingTitle,
  ShippingSummary,
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
      if (appCtx.shippingMethodName) {
        return appCtx.shippingMethodName
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

const ShippingLineItems: LineItemType[] = LINE_ITEMS_SHIPPABLE

export const StepShipping: React.FC<Props> = () => {
  const appCtx = useContext(AppContext)
  const accordionCtx = useContext(AccordionContext)
  const gtmCtx = useContext(GTMContext)

  const { t } = useTranslation()

  if (!appCtx || !accordionCtx) {
    return null
  }

  const messages: ErrorComponentProps["messages"] = [
    {
      code: "OUT_OF_STOCK",
      resource: "line_items",
      message: t("stepShipping.outOfStock"),
    },
    {
      code: "NO_SHIPPING_METHODS",
      resource: "shipments",
      message: t("stepShipping.notAvailable"),
    },
  ]

  const { shipments, isShipmentRequired, saveShipments, selectShipment } =
    appCtx

  const [canContinue, setCanContinue] = useState(false)
  const [isLocalLoader, setIsLocalLoader] = useState(false)
  const [outOfStockError, setOutOfStockError] = useState(false)
  const [shippingMethodError, setShippingMethodError] = useState(false)

  useEffect(() => {
    if (shipments.length > 0) {
      setCanContinue(
        !shipments?.map((s) => s.shippingMethodId).includes(undefined)
      )
    }
  }, [shipments])

  const handleChange = (
    shippingMethod: ShippingMethodCollection,
    shipmentId: string
  ): void => {
    selectShipment(shippingMethod, shipmentId)
  }

  const handleSave = async () => {
    setIsLocalLoader(true)

    saveShipments()

    setIsLocalLoader(false)
    if (gtmCtx?.fireAddShippingInfo) {
      await gtmCtx.fireAddShippingInfo()
    }
  }

  const autoSelectCallback = async () => {
    if (gtmCtx?.fireAddShippingInfo) {
      await gtmCtx.fireAddShippingInfo()
    }
    appCtx.autoSelectShippingMethod()
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
              <>
                {
                  <ShipmentsContainer>
                    <OutOfStock
                      cartUrl={appCtx.cartUrl}
                      messages={messages}
                      setOutOfStockError={setOutOfStockError}
                    />
                    <NoShippingMethods
                      messages={messages}
                      setShippingMethodError={setShippingMethodError}
                    />

                    {!shippingMethodError && !outOfStockError && (
                      <>
                        <Shipment
                          autoSelectSingleShippingMethod={autoSelectCallback}
                          loader={
                            <div className="animate-pulse">
                              <div className="w-1/2 h-5 bg-gray-200" />
                              <div className="h-20 my-5 bg-gray-200" />
                            </div>
                          }
                        >
                          <ShippingWrapper data-test-id="shipments-container">
                            {shipments.length > 1 && (
                              <ShippingTitle>
                                <ShipmentField name="key_number">
                                  {(props) => {
                                    const index = shipments.findIndex(
                                      (item) =>
                                        item.shipmentId === props.shipment.id
                                    )

                                    return (
                                      <Trans
                                        i18nKey="stepShipping.shipment"
                                        components={{
                                          Wrap: (
                                            <span className="text-sm font-medium text-gray-500" />
                                          ),
                                        }}
                                        values={{
                                          current: index + 1,
                                          total: shipments.length.toString(),
                                        }}
                                      />
                                    )
                                  }}
                                </ShipmentField>
                              </ShippingTitle>
                            )}
                            <GridContainer className="mb-6">
                              <ShippingMethod
                                emptyText={t("stepShipping.notAvailable")}
                              >
                                <ShippingSummary data-test-id="shipping-methods-container">
                                  <StyledShippingMethodRadioButton
                                    data-test-id="shipping-method-button"
                                    className="form-radio mt-0.5 md:mt-0"
                                    onChange={(shippingMethod, shipmentId) =>
                                      handleChange(shippingMethod, shipmentId)
                                    }
                                  />
                                  <ShippingMethodName data-test-id="shipping-method-name">
                                    {(props) => {
                                      const deliveryLeadTime =
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-ignore
                                        props?.deliveryLeadTimeForShipment
                                      return (
                                        <label
                                          className="flex flex-col p-3 border rounded cursor-pointer hover:border-primary transition duration-200 ease-in"
                                          htmlFor={props.htmlFor}
                                        >
                                          <ShippingLineItemTitle>
                                            {props.label}
                                          </ShippingLineItemTitle>
                                          {deliveryLeadTime?.min_days &&
                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                            // @ts-ignore
                                            deliveryLeadTime?.max_days && (
                                              <ShippingSummaryItemDescription>
                                                <Trans i18nKey="stepShipping.deliveryLeadTime">
                                                  <DeliveryLeadTime
                                                    type="min_days"
                                                    data-test-id="delivery-lead-time-min-days"
                                                  />
                                                  <DeliveryLeadTime
                                                    type="max_days"
                                                    data-test-id="delivery-lead-time-max-days"
                                                    className="mr-1"
                                                  />
                                                </Trans>
                                              </ShippingSummaryItemDescription>
                                            )}
                                          <ShippingSummaryValue>
                                            <ShippingMethodPrice
                                              data-test-id="shipping-method-price"
                                              labelFreeOver={t("general.free")}
                                            />
                                          </ShippingSummaryValue>
                                        </label>
                                      )
                                    }}
                                  </ShippingMethodName>
                                </ShippingSummary>
                              </ShippingMethod>
                            </GridContainer>
                            <LineItemsContainer>
                              {ShippingLineItems.map((type) => (
                                <LineItem key={type} type={type}>
                                  <ShippingLineItem>
                                    <LineItemImage
                                      width={50}
                                      className="self-start p-1 border rounded"
                                    />
                                    <ShippingLineItemDescription>
                                      <ShippingLineItemTitle>
                                        <LineItemName data-test-id="line-item-name" />
                                      </ShippingLineItemTitle>
                                      <ShippingLineItemQty>
                                        <LineItemQuantity readonly>
                                          {({ quantity }) =>
                                            !!quantity &&
                                            t("orderRecap.quantity", {
                                              count: quantity,
                                            })
                                          }
                                        </LineItemQuantity>
                                      </ShippingLineItemQty>
                                    </ShippingLineItemDescription>
                                  </ShippingLineItem>
                                  <StockTransfer>
                                    <ShippingLineItem>
                                      <StockTransferField
                                        attribute="image_url"
                                        tagElement="img"
                                        width={50}
                                        className="self-start p-1 border rounded"
                                      />
                                      <ShippingLineItemDescription>
                                        <ShippingLineItemTitle>
                                          <StockTransferField
                                            attribute="name"
                                            tagElement="p"
                                            data-test-id="line-item-name"
                                          />
                                        </ShippingLineItemTitle>
                                        <ShippingLineItemQty>
                                          <Trans
                                            i18nKey={
                                              "orderRecap.quantity_stock"
                                            }
                                          >
                                            <StockTransferField
                                              attribute="quantity"
                                              tagElement="span"
                                            />
                                          </Trans>
                                        </ShippingLineItemQty>
                                      </ShippingLineItemDescription>
                                    </ShippingLineItem>
                                  </StockTransfer>
                                </LineItem>
                              ))}
                            </LineItemsContainer>
                          </ShippingWrapper>
                        </Shipment>
                        <ButtonWrapper>
                          <Button
                            disabled={!canContinue || isLocalLoader}
                            // disabled={!canContinue || isLocalLoader}
                            data-test-id="save-shipping-button"
                            onClick={handleSave}
                          >
                            {isLocalLoader && <SpinnerIcon />}
                            {t("stepShipping.continueToPayment")}
                          </Button>
                        </ButtonWrapper>
                      </>
                    )}
                  </ShipmentsContainer>
                }
              </>
            )}
          </div>
        )}
      </StepContent>
    </StepContainer>
  )
}
