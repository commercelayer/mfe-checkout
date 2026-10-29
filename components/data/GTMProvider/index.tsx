import type { LineItem, Order } from "@commercelayer/sdk"
import { AppContext } from "components/data/AppProvider"
import type { TypeAccepted } from "components/data/AppProvider/utils"
import { LINE_ITEMS_SHOPPABLE } from "components/utils/constants"
import { createContext, useContext, useEffect, useRef } from "react"
import TagManager from "react-gtm-module"

import type { DataLayerItemProps, DataLayerProps } from "./typings"

interface GTMProviderData {
  fireAddShippingInfo: (order: Order) => void
  fireAddPaymentInfo: (order?: Order) => void
  firePurchase: (order?: Order) => void
}

export const GTMContext = createContext<GTMProviderData | null>(null)

interface GTMProviderProps {
  children: React.ReactNode
  gtmId: NullableType<string>
  skipBeginCheckout: boolean
}

export const GTMProvider: React.FC<GTMProviderProps> = ({
  children,
  gtmId,
  skipBeginCheckout,
}) => {
  const isFirstLoading = useRef(true)
  const ctx = useContext(AppContext)

  // The fire* callbacks below are handed to StepPlaceOrder through context and
  // called from an async handler, so a value captured when this component
  // rendered can be several renders stale by then. Coming back from a payment
  // redirect the order is placed before the order lands in this context at all,
  // and the closure's `order` is still undefined — every field of the event goes
  // out undefined. Read it at call time instead.
  const orderRef = useRef<NullableType<Order>>(ctx?.order)
  orderRef.current = ctx?.order

  useEffect(() => {
    if (!gtmId || !ctx || !ctx.order) return

    if (isFirstLoading.current) {
      isFirstLoading.current = false
      TagManager.initialize({ gtmId })
      if (!skipBeginCheckout) {
        fireBeginCheckout(ctx.order)
      }
    }
  }, [gtmId, ctx, skipBeginCheckout])

  if (!gtmId || !ctx) {
    return <>{children}</>
  }

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
      quantity,
    }
  }

  const fireBeginCheckout = (order: Order) => {
    const lineItems = order.line_items?.filter((line_item) => {
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

  const fireAddShippingInfo = (order: Order) => {
    const shipments = order?.shipments

    shipments?.forEach((shipment) => {
      const lineItems = shipment.stock_line_items?.map(
        // @ts-expect-error: No compatible type in StockLineItem
        (e) => e && mapItemsToGTM(e.line_item),
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

  // `placedOrder` is what the caller holds — after a redirect that is the only
  // copy that exists yet.
  const fireAddPaymentInfo = (placedOrder?: Order) => {
    const order = placedOrder ?? orderRef.current
    const lineItems = order?.line_items?.filter((line_item) => {
      return LINE_ITEMS_SHOPPABLE.includes(line_item.item_type as TypeAccepted)
    })

    const paymentMethod = order?.payment_method

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

  const firePurchase = (placedOrder?: Order) => {
    const order = placedOrder ?? orderRef.current
    const lineItems = order?.line_items?.filter((line_item) => {
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
