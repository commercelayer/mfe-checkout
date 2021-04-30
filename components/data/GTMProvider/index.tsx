import CLayer, { LineItemCollection, Order } from "@commercelayer/js-sdk"
import { AppContext } from "components/data/AppProvider"
import { createContext, useEffect, useContext } from "react"
import TagManager from "react-gtm-module"

interface GTMProviderData {
  fireAddShippingInfo: () => void
  fireAddPaymentInfo: () => void
  firePurchase: () => void
}

export const GTMContext = createContext<GTMProviderData | null>(null)

interface GTMProviderProps {
  children: React.ReactNode
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
  const ctx = useContext(AppContext)

  if (!ctx) {
    return <>{children}</>
  }

  const { accessToken, orderId } = ctx

  useEffect(() => {
    if (gtmId) {
      TagManager.initialize({ gtmId: gtmId })
      fireBeginCheckout()
    }
  }, [])

  const fetchOrder = async () => {
    CLayer.init({
      accessToken: accessToken,
      endpoint: `${process.env.NEXT_PUBLIC_CLAYER_DOMAIN}`,
    })

    return Order.select(
      "coupon_code",
      "currency_code",
      "total_amount_with_taxes_float",
      "shipping_amount_float",
      "total_tax_amount_float"
    )
      .includes(
        "line_items",
        "shipments",
        "shipments.shipping_method",
        "payment_method"
      )
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

  const mapItemsToGTM = ({
    name,
    currencyCode,
    skuCode,
    quantity,
    totalAmountFloat,
  }: LineItemCollection) => {
    return {
      item_id: skuCode,
      item_name: name,
      price: totalAmountFloat,
      currency: currencyCode,
      quantity: quantity,
    }
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
        items: lineItems?.toArray().map(mapItemsToGTM),
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

    shipments.forEach(async (shipment) => {
      const lineItems = shipment
        .shipmentLineItems()
        ?.toArray()
        ?.map((item) => item?.lineItem())
        .map((e) => e && mapItemsToGTM(e))

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

  const fireAddPaymentInfo = async () => {
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

    const paymentMethod = order.paymentMethod()

    return pushDataLayer({
      eventName: "add_payment_info",
      dataLayer: {
        coupon: order?.couponCode,
        currency: order?.currencyCode,
        items: lineItems?.toArray().map(mapItemsToGTM),
        value: paymentMethod?.priceAmountFloat,
        payment_type: paymentMethod?.name,
      },
    })
  }

  const firePurchase = async () => {
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
      eventName: "purchase",
      dataLayer: {
        coupon: order?.couponCode,
        currency: order?.currencyCode,
        items: lineItems?.toArray().map(mapItemsToGTM),
        transaction_id: null, // es. "T_12345",
        shipping: order?.shippingAmountFloat,
        value: order?.totalAmountWithTaxesFloat,
        tax: order?.totalTaxAmountFloat,
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
