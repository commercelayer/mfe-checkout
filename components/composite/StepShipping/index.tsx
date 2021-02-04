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
import { useContext } from "react"

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

  const { hasShippingMethod, refetchOrder } = appCtx

  const handleChange = () => {
    console.log("click")
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
                    onChange={handleChange}
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
              <Button>
                <a data-cy="save-shipments-button" onClick={refetchOrder}>
                  Continue to Payment
                </a>
              </Button>
            </div>
          </ShipmentsContainer>
        ) : hasShippingMethod ? (
          <div>
            {t("stepShipping.shippingMethod")}
            {"Selezionato"}
          </div>
        ) : (
          <div>-</div>
        )}
      </StepContent>
    </div>
  )
}
