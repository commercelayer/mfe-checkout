import { OrderCollection, ShipmentCollection } from "@commercelayer/js-sdk"
import { LineItemsDataLayerProps } from "components/data/AppProvider/fetchOrderById"

import TagManager from "react-gtm-module"

interface PushDataLayerProps {
  eventName:
    | "begin_checkout"
    | "add_shipping_info"
    | "add_payment_info"
    | "purchase"
  dataLayer: object
}

export interface GTMFireResponse {
  fireBeginCheckout?: () => void
  fireAddShippingInfo?: () => void
  fireAddPaymentInfo?: () => void
  firePurchase?: () => void
}

export interface GTMFireProps {
  lineItems: Array<LineItemsDataLayerProps> | undefined
  shipments: ShipmentCollection[] | undefined
  order: OrderCollection | undefined
}

export const fireGTM = ({ lineItems, shipments, order }: GTMFireProps) => {
  const pushDataLayer = ({ eventName, dataLayer }: PushDataLayerProps) => {
    try {
      TagManager.dataLayer({
        dataLayer: {
          event: eventName,
          ecommerce: dataLayer,
        },
      })
    } catch (error) {
      console.log(error)
    }
  }

  const fireBeginCheckout = () => {
    return pushDataLayer({
      eventName: "begin_checkout",
      dataLayer: {
        coupon: order?.couponCode,
        currency: order?.currencyCode,
        items: lineItems,
        value: order?.totalAmountWithTaxesFloat,
      },
    })
  }

  const fireAddShippingInfo = () => {
    if (shipments) {
      shipments.forEach((shipment) => {
        const shipmentLineItems = shipment
          .shipmentLineItems()
          ?.toArray()
          .map((a) => {
            const lineItem = a.lineItem()
            if (lineItem) {
              return {
                item_id: lineItem.skuCode,
                item_name: lineItem.name,
                price: lineItem.totalAmountFloat,
                currency: lineItem.currencyCode,
                quantity: lineItem.quantity,
              }
            }
          })

        return pushDataLayer({
          eventName: "add_shipping_info",
          dataLayer: {
            coupon: order?.couponCode,
            currency: order?.currencyCode,
            items: { ...shipmentLineItems },
            value: shipment.shippingMethod()?.priceAmountForShipmentFloat,
            shipping_tier: shipment.shippingMethod()?.name,
          },
        })
      })
    }
  }

  const fireAddPaymentInfo = () => {
    return pushDataLayer({ eventName: "add_payment_info", dataLayer: {} })
  }

  const firePurchase = () => {
    return pushDataLayer({ eventName: "purchase", dataLayer: {} })
  }

  return {
    fireBeginCheckout,
    fireAddShippingInfo,
    fireAddPaymentInfo,
    firePurchase,
  }
}
