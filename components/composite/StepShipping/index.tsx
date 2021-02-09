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
import { useContext, useState, useEffect } from "react"

import "twin.macro"

import { AppContext } from "components/data/AppProvider"
import { useTranslation } from "components/data/i18n"
import { Button } from "components/ui/Button"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"

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
  const { t } = useTranslation()

  if (!appCtx || !appCtx.hasShippingAddress) {
    return null
  }

  const { shipments, hasShippingMethod, refetchOrder } = appCtx

  const [shipmentsSelected, setShipmentsSelected] = useState(shipments)
  const [canContinue, setCanContinue] = useState(false)

  useEffect(() => {
    setCanContinue(
      !shipmentsSelected.map((s) => s.shippingMethodId).includes(undefined)
    )
  }, [shipmentsSelected])

  const handleChange = (
    shippingMethod: ShippingMethodCollection | Record<string, any>
  ): void => {
    setShipmentsSelected((shipmentsSelected) =>
      shipmentsSelected.map((shipment) => {
        return shipment.shipmentId === shippingMethod.shipmentId
          ? {
              ...shipment,
              shippingMethodId: shippingMethod.id,
            }
          : shipment
      })
    )
  }

  return (
    <div className={className}>
      <StepHeader
        stepNumber={2}
        status={isActive ? "edit" : "done"}
        label={t("stepShipping.delivery")}
        info={
          isActive
            ? t("stepShipping.summary")
            : "Metodo di spedizione selezionato"
        }
        onEditRequest={() => {
          onToggleActive()
        }}
      />
      <StepContent>
        {isActive ? (
          <ShipmentsContainer>
            <Shipment>
              <div>Shipments</div>
              <LineItemsContainer>
                <LineItem>
                  <div className="flex items-center justify-between p-5 border-b">
                    <LineItemImage className="p-2" width={80} />
                    <LineItemName data-cy="line-item-name" className="p-2" />
                    <LineItemQuantity
                      readonly
                      data-cy="line-item-quantity"
                      max={100}
                      className="p-2"
                    />
                  </div>
                  <div>
                    <StockTransfer>
                      <div className="flex flex-row" data-cy="stock-transfer">
                        <StockTransferField className="px-1" type="quantity" />{" "}
                        of <LineItemQuantity readonly className="px-1" />
                        items will undergo a transfer
                      </div>
                    </StockTransfer>
                  </div>
                </LineItem>
              </LineItemsContainer>
              <ShippingMethod>
                <div className="flex items-center justify-around w-2/3 p-5">
                  <ShippingMethodRadioButton
                    data-cy="shipping-method-button"
                    onChange={(
                      shippingMethod:
                        | ShippingMethodCollection
                        | Record<string, any>
                    ) => handleChange(shippingMethod)}
                  />
                  <ShippingMethodName data-cy="shipping-method-name" />
                  <ShippingMethodPrice data-cy="shipping-method-price" />
                  <div className="flex">
                    <DeliveryLeadTime
                      type="minDays"
                      data-cy="delivery-lead-time-min-days"
                    />{" "}
                    -{" "}
                    <DeliveryLeadTime
                      type="maxDays"
                      data-cy="delivery-lead-time-max-days"
                      className="mr-1"
                    />
                    days
                  </div>
                </div>
              </ShippingMethod>
            </Shipment>
            <div tw="flex justify-end">
              <Button
                disabled={!canContinue}
                data-cy="save-shipments-button"
                onClick={refetchOrder}
              >
                Continue to Payment
              </Button>
            </div>
          </ShipmentsContainer>
        ) : hasShippingMethod ? (
          <div>
            {t("stepShipping.shippingMethod")}
            {"Selezionato"}
            <ShipmentsContainer>
              <div className="mt-10">Shipments Recap</div>
              <Shipment>
                {/* remove [0] when id of ShippingMethod is an array of ids */}
                <ShippingMethod readonly>
                  <div className="flex items-center justify-around w-2/3 p-5">
                    <ShippingMethodName data-cy="shipping-method-name-recap" />
                    <ShippingMethodPrice />
                    <div className="flex">
                      <DeliveryLeadTime type="minDays" /> -{" "}
                      <DeliveryLeadTime type="maxDays" className="mr-1" />
                      days
                    </div>
                  </div>
                </ShippingMethod>
              </Shipment>
            </ShipmentsContainer>
          </div>
        ) : (
          <div>Metodo di spedizione da selezionare</div>
        )}
      </StepContent>
    </div>
  )
}
