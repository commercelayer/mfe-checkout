import { TypeAccepted } from "@commercelayer/react-components/lib/utils/getLineItemsCount"
import CommerceLayer, { LineItem } from "@commercelayer/sdk"
import { createContext, useEffect, useContext } from "react"
import TagManager from "react-gtm-module"

import { AppContext } from "components/data/AppProvider"
import { LINE_ITEMS_SHOPPABLE } from "components/utils/constants"

import { DataLayerItemProps, DataLayerProps } from "./typings"

interface GTMProviderData {
  fireAddShippingInfo: () => Promise<void>
  fireAddPaymentInfo: () => Promise<void>
  firePurchase: () => Promise<void>
}

export const GTMContext = createContext<GTMProviderData | null>(null)

interface GTMProviderProps {
  children: React.ReactNode
  gtmId?: string
}

export const GTMProvider: React.FC<GTMProviderProps> = ({
  children,
  gtmId,
}) => {
  if (!gtmId) {
    return <>{children}</>
  }
  const ctx = useContext(AppContext)

  if (!ctx) {
    return <>{children}</>
  }

  const { accessToken, orderId, slug, domain, getOrderFromRef } = ctx

  const cl = CommerceLayer({
    organization: slug,
    accessToken: accessToken,
    domain,
  })

  useEffect(() => {
    if (gtmId) {
      TagManager.initialize({ gtmId: gtmId })
      fireBeginCheckout()
    }
  }, [])

  const pushDataLayer = ({ eventName, dataLayer }: DataLayerProps) => {
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

  const mapItemsToGTM = ({
    name,
    currency_code,
    sku_code,
    bundle_code,
    quantity,
    total_amount_float,
  }: LineItem): DataLayerItemProps => {
    return {
      item_id: sku_code || bundle_code,
      item_name: name,
      price: total_amount_float,
      currency: currency_code,
      quantity: quantity,
    }
  }

  const fireBeginCheckout = async () => {
    const order = await getOrderFromRef()
    const lineItems = (
      await cl.orders.retrieve(orderId, {
        include: ["line_items"],
        fields: {
          orders: ["line_items"],
          line_items: [
            "sku_code",
            "bundle_code",
            "name",
            "total_amount_float",
            "currency_code",
            "quantity",
            "item_type",
          ],
        },
      })
    ).line_items?.filter((line_item) => {
      return LINE_ITEMS_SHOPPABLE.includes(line_item.item_type as TypeAccepted)
    })

    return pushDataLayer({
      eventName: "begin_checkout",
      dataLayer: {
        coupon: order?.coupon_code,
        currency: order?.currency_code,
        items: lineItems?.map(mapItemsToGTM),
        value: order?.total_amount_with_taxes_float,
      },
    })
  }

  const fireAddShippingInfo = async () => {
    const order = await getOrderFromRef()
    const shipments = (
      await cl.orders.retrieve(orderId, {
        include: [
          "shipments.shipping_method",
          "shipments.shipment_line_items",
          "shipments.shipment_line_items.line_item",
        ],
        fields: {
          orders: ["shipments"],
          shipments: ["shipping_method", "shipment_line_items"],
          shipping_method: ["name", "price_amount_for_shipment_float"],
          shipment_line_items: ["line_item"],
          line_item: [
            "sku_code",
            "name",
            "total_amount_float",
            "currency_code",
            "quantity",
            "item_type",
          ],
        },
      })
    ).shipments

    shipments?.forEach(async (shipment) => {
      const lineItems = shipment.shipment_line_items?.map(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (e) => e && mapItemsToGTM(e.line_item)
      )

      pushDataLayer({
        eventName: "add_shipping_info",
        dataLayer: {
          coupon: order?.coupon_code,
          currency: order?.currency_code,
          items: lineItems,
          value: shipment.shipping_method?.price_amount_for_shipment_float,
          shipping_tier: shipment.shipping_method?.name,
        },
      })
    })
  }

  const fireAddPaymentInfo = async () => {
    const order = await getOrderFromRef()
    const lineItems = order.line_items?.filter((line_item) => {
      return LINE_ITEMS_SHOPPABLE.includes(line_item.item_type as TypeAccepted)
    })

    const paymentMethod = order.payment_method

    return pushDataLayer({
      eventName: "add_payment_info",
      dataLayer: {
        coupon: order?.coupon_code,
        currency: order?.currency_code,
        items: lineItems?.map(mapItemsToGTM),
        value: paymentMethod?.price_amount_float,
        payment_type: paymentMethod?.name,
      },
    })
  }

  const firePurchase = async () => {
    const order = await getOrderFromRef()

    const lineItems = order.line_items?.filter((line_item) => {
      return LINE_ITEMS_SHOPPABLE.includes(line_item.item_type as TypeAccepted)
    })

    return pushDataLayer({
      eventName: "purchase",
      dataLayer: {
        coupon: order?.coupon_code,
        currency: order?.currency_code,
        items: lineItems?.map(mapItemsToGTM),
        transaction_id: order?.number,
        shipping: order?.shipping_amount_float,
        value: order?.total_amount_with_taxes_float,
        tax: order?.total_tax_amount_float,
      },
    })
  }

  return (
    <GTMContext.Provider
      value={{
        fireAddShippingInfo,
        fireAddPaymentInfo,
        firePurchase,
      }}
    >
      {children}
    </GTMContext.Provider>
  )
}
