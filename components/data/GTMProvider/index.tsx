import {
  Order,
  OrderCollection,
  ShipmentCollection,
} from "@commercelayer/js-sdk"
import { createContext, useState, useEffect } from "react"

import TagManager from "react-gtm-module"

// import { fireGTM, GTMFireResponse } from "./fireGTM"

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

export const GTMProvider: React.FC<GTMProviderProps> = ({
  children,
  gtmId,
}) => {
  if (!gtmId) {
    return <>{children}</>
  }

  // 
  
  const fetchOrder = async () => {
    return Order.select("coupon_code", "currency_code", "total_amount_with_taxes_float").includes(
      "line_items",
      "shipments",
      "shipments.shipping_method",
    ).find(orderId)
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

  const mapItems = (item) => {

  }

  const fireBeginCheckout = async () => {
    const order = await fetchOrder()
    const lineItems = (await order.lineItems()?.where({itemType: "skus"}).all()).toArray()
    return pushDataLayer({
      eventName: "begin_checkout",
      dataLayer: {
        coupon: order?.couponCode,
        currency: order?.currencyCode,
        items: lineItems.map(({ name, currencyCode, skuCode, quantity, totalAmountFloat }) => ({
          item_id: skuCode,
          item_name: name,
          price: totalAmountFloat,
          currency: currencyCode,
          quantity: quantity,
        })),
        value: order?.totalAmountWithTaxesFloat,
      },
    })
  }


  const fireAddShippingInfo = () => {
    
  }

  const fireAddPaymentInfo = () => {
    
  }

  const firePurchase = () => {
    
  }

  // useEffect(() => {
  //   fetchOrderHandle(orderId, accessToken)
  // }, [orderId, accessToken])

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
