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

  const { order } = ctx

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

  const fireAddPaymentInfo = (orderArg?: Order) => {
    // Prefer the order passed by the caller (always fully loaded) over the
    // context order, which may lag behind due to the deferred setOrder state
    // update — e.g. on the auto-place flow after a gateway redirect back.
    const currentOrder = orderArg ?? order

    const lineItems = currentOrder?.line_items?.filter((line_item) => {
      return LINE_ITEMS_SHOPPABLE.includes(line_item.item_type as TypeAccepted)
    })

    const paymentMethod = currentOrder?.payment_method

    return pushDataLayer({
      eventName: "add_payment_info",
      dataLayer: {
        coupon: currentOrder?.coupon_code,
        currency: currentOrder?.currency_code,
        items: lineItems?.map(mapItemsToGTM),
        value: paymentMethod?.price_amount_float,
        payment_type: paymentMethod?.name,
      },
    })
  }

  const firePurchase = (orderArg?: Order) => {
    const currentOrder = orderArg ?? order

    const lineItems = currentOrder?.line_items?.filter((line_item) => {
      return LINE_ITEMS_SHOPPABLE.includes(line_item.item_type as TypeAccepted)
    })

    return pushDataLayer({
      eventName: "purchase",
      dataLayer: {
        coupon: currentOrder?.coupon_code,
        currency: currentOrder?.currency_code,
        items: lineItems?.map(mapItemsToGTM),
        transaction_id: currentOrder?.number,
        shipping: currentOrder?.shipping_amount_float,
        value: currentOrder?.total_amount_with_taxes_float,
        tax: currentOrder?.total_tax_amount_float,
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
