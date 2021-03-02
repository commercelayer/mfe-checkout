import CLayer, { LineItemCollection, Order } from "@commercelayer/js-sdk"
import { SingleRelationship } from "@commercelayer/js-sdk/dist/typings/Library"
import { createContext, useEffect } from "react"

import TagManager from "react-gtm-module"

interface GTMProviderData {
  fireBeginCheckout?: () => void
  fireAddShippingInfo?: () => void
  fireAddPaymentInfo?: () => void
  firePurchase?: () => void
}

export const GTMContext = createContext<GTMProviderData | null>(null)

interface GTMProviderProps {
  gtmId?: string
}

interface PushDataLayerProps {
  eventName:
    | "begin_checkout"
    | "add_shipping_info"
    | "add_payment_info"
    | "purchase"
  dataLayer: object
}

export interface LineItemsDataLayerProps {
  skuCode: string
  name: string
  totalAmountFloat: number
  currencyCode: string
  quantity: number
  id: string
}

export const GTMProvider: React.FC<GTMProviderProps> = ({
  children,
  gtmId,
}) => {
  if (!gtmId) {
    return <>{children}</>
  }

  const { accessToken, orderId } = children?.props

  useEffect(() => {
    if (gtmId) {
      console.log("mount gtm")
      TagManager.initialize({ gtmId: gtmId })
      fireBeginCheckout()
    }
  }, [])

  const fetchOrder = async () => {
    CLayer.init({
      accessToken: accessToken,
      endpoint: `${process.env.NEXT_PUBLIC_API_DOMAIN}`,
    })

    return Order.select(
      "coupon_code",
      "currency_code",
      "total_amount_with_taxes_float"
    )
      .includes("line_items", "shipments", "shipments.shipping_method")
      .find(orderId)
  }

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

  const mapItems = (
    items:
      | LineItemCollection[]
      | SingleRelationship<LineItemCollection>[]
      | undefined
  ) => {
    if (!items) {
      return
    }

    const lineItems = items as LineItemsDataLayerProps[]
    return lineItems.map(
      ({ name, currencyCode, skuCode, quantity, totalAmountFloat }) => ({
        item_id: skuCode,
        item_name: name,
        price: totalAmountFloat,
        currency: currencyCode,
        quantity: quantity,
      })
    )
  }

  const fireBeginCheckout = async () => {
    const order = await fetchOrder()
    const lineItems = await order
      .lineItems()
      ?.where({ itemTypeCont: "skus" })
      .select(
        "sku_code",
        "name",
        "total_amount_float",
        "currency_code",
        "quantity"
      )
      .all()

    return pushDataLayer({
      eventName: "begin_checkout",
      dataLayer: {
        coupon: order?.couponCode,
        currency: order?.currencyCode,
        items: lineItems && mapItems(lineItems?.toArray()),
        value: order?.totalAmountWithTaxesFloat,
      },
    })
  }

  const fireAddShippingInfo = async () => {
    const order = await fetchOrder()
    const shipments =
      (
        await order
          .shipments()
          ?.includes(
            "shipping_method",
            "shipment_line_items",
            "shipment_line_items.line_item"
          )
          .load()
      )?.toArray() || []

    shipments.forEach((shipment) => {
      const shipmentLineItems = shipment.shipmentLineItems()?.toArray()

      const lineItems = mapItems(
        shipmentLineItems?.map((item) => item.lineItem())
      )

      return pushDataLayer({
        eventName: "add_shipping_info",
        dataLayer: {
          coupon: order?.couponCode,
          currency: order?.currencyCode,
          items: lineItems,
          value: shipment.shippingMethod()?.priceAmountForShipmentFloat,
          shipping_tier: shipment.shippingMethod()?.name,
        },
      })
    })
  }

  const fireAddPaymentInfo = () => {}

  const firePurchase = () => {}

  return (
    <GTMContext.Provider
      value={{
        fireBeginCheckout,
        fireAddShippingInfo,
        fireAddPaymentInfo,
        firePurchase,
      }}
    >
      {children}
    </GTMContext.Provider>
  )
}
