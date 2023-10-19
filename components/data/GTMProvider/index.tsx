import { CommerceLayer, LineItem } from "@commercelayer/sdk"
import { createContext, useEffect, useContext } from "react"
import TagManager from "react-gtm-module"

import { AppContext } from "components/data/AppProvider"
import type { TypeAccepted } from "components/data/AppProvider/utils"
import { LINE_ITEMS_SHOPPABLE } from "components/utils/constants"

import {
  DataLayerItemProps,
  DataLayerProps,
  RakutenDataLayerItemProps,
} from "./typings"

interface GTMProviderData {
  fireAddShippingInfo: () => Promise<void>
  fireAddPaymentInfo: () => Promise<void>
  firePurchase: () => Promise<void>
}

export const GTMContext = createContext<GTMProviderData | null>(null)

interface GTMProviderProps {
  children: React.ReactNode
  gtmId: NullableType<string>
}

function isFloat(n: number) {
  return Number(n) === n && n % 1 !== 0
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
    accessToken,
    domain,
  })

  useEffect(() => {
    if (gtmId != null) {
      TagManager.initialize({ gtmId })
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
    metadata,
  }: LineItem): DataLayerItemProps => {
    return {
      item_id: sku_code || bundle_code,
      item_name: name,
      price: total_amount_float,
      currency: currency_code,
      quantity: quantity,
      item_group_id: metadata?.product_reference || "",
    }
  }
  const mapItemsToRakuten = ({
    name,
    sku_code,
    bundle_code,
    quantity,
    total_amount_float,
    discount_float,
  }: LineItem): RakutenDataLayerItemProps => {
    return {
      SKU: sku_code || bundle_code,
      productName: name,
      unitPrice: (total_amount_float || 0) + (discount_float || 0),
      unitPriceLessTax: (total_amount_float || 0) + (discount_float || 0),
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
        market_id: order?.market?.id,
      },
    })
  }

  const fireAddShippingInfo = async () => {
    const order = await getOrderFromRef()
    const shipments = (
      await cl.orders.retrieve(orderId, {
        include: [
          "shipments.shipping_method",
          "shipments.stock_line_items",
          "shipments.stock_line_items.line_item",
        ],
        fields: {
          orders: ["shipments"],
          shipments: ["shipping_method", "stock_line_items"],
          shipping_method: ["name", "price_amount_for_shipment_float"],
          stock_line_items: ["line_item"],
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
      const lineItems = shipment.stock_line_items?.map(
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
          market_id: order?.market?.id,
          customer_email: order?.customer_email,
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
        market_id: order?.market?.id,
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
        rakutenItems: lineItems?.map(mapItemsToRakuten),
        transaction_id: order?.number,
        shipping: order?.shipping_amount_float,
        value: order?.total_amount_with_taxes_float,
        tax: order?.total_tax_amount_float,
        taxRate: order?.tax_rate, // taxRate can be percentage or decimal
        taxRatePer: isFloat((order?.tax_rate || 0) * 1) // taxRatePer will always be in percentage format, need to multiply to 1 so that any returned value would be converted to a number, tax_rate is being returned as string
          ? (order?.tax_rate || 0) * 100
          : order?.tax_rate,
        market_id: order?.market?.id,
        customer_email: order?.customer_email,
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
