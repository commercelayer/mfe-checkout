import {
  DeliveryLeadTime,
  ShippingMethodName,
  ShippingMethodPrice,
} from "@commercelayer/react-components"
import { Order, ShippingMethod as ShippingMethodType } from "@commercelayer/sdk"
import { Metadata } from "@commercelayer/sdk/lib/cjs/resource"
import { useRef, useState } from "react"
import { Trans, useTranslation } from "react-i18next"

import {
  ShippingLineItemTitle,
  ShippingSummary,
  ShippingSummaryItemDescription,
  ShippingSummaryValue,
  StyledShippingMethodRadioButton,
} from "../styled"

import { Modal } from "components/composite/Modal"
import { ShipmondoServicePointSelector } from "components/composite/ShipmondoServicePointSelector"

interface ShippingMethodProps {
  handleChange: (params: {
    shippingMethod: ShippingMethodType
    shipmentId: string
    order?: Order
  }) => void
}

export const ShippingMethod: React.FC<ShippingMethodProps> = ({
  handleChange,
}) => {
  const { t } = useTranslation()
  const shippingMethodMeta = useRef<Metadata>()
  const [showServicePointModal, setShowServicePointModal] = useState(false)

  return (
    <>
      <Modal
        show={showServicePointModal}
        onClose={() => setShowServicePointModal(false)}
      >
        <ShipmondoServicePointSelector
          onCancel={() => setShowServicePointModal(false)}
          onSelect={(servicePointId) => {
            setShowServicePointModal(false)
            console.log(servicePointId)
          }}
        />
      </Modal>

      <ShippingSummary data-testid="shipping-methods-container">
        <StyledShippingMethodRadioButton
          data-testid="shipping-method-button"
          className="form-radio mt-0.5 md:mt-0"
          onChange={(params) => handleChange(params)}
          onClick={() => {
            if (
              shippingMethodMeta.current?.api_provider === "shipmondo" &&
              shippingMethodMeta.current?.type === "service_point"
            ) {
              setShowServicePointModal(true)
            }
          }}
        />
        <ShippingMethodName data-testid="shipping-method-name">
          {(props) => {
            shippingMethodMeta.current = props.shippingMethod?.metadata
            const deliveryLeadTime =
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              props?.deliveryLeadTimeForShipment
            return (
              <label
                className="flex flex-col p-3 border rounded cursor-pointer hover:border-primary transition duration-200 ease-in"
                htmlFor={props.htmlFor}
              >
                <ShippingLineItemTitle>{props.label}</ShippingLineItemTitle>
                {deliveryLeadTime?.min_days &&
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  deliveryLeadTime?.max_days && (
                    <ShippingSummaryItemDescription>
                      <Trans i18nKey="stepShipping.deliveryLeadTime">
                        <DeliveryLeadTime
                          type="min_days"
                          data-testid="delivery-lead-time-min-days"
                        />
                        <DeliveryLeadTime
                          type="max_days"
                          data-testid="delivery-lead-time-max-days"
                          className="mr-1"
                        />
                      </Trans>
                    </ShippingSummaryItemDescription>
                  )}
                <ShippingSummaryValue>
                  <ShippingMethodPrice
                    data-testid="shipping-method-price"
                    labelFreeOver={t("general.free")}
                    labelExternal={t("stepShipping.externalPrice")}
                  />
                </ShippingSummaryValue>
              </label>
            )
          }}
        </ShippingMethodName>
      </ShippingSummary>
    </>
  )
}
