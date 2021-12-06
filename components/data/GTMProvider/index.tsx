import CommerceLayer, { LineItem } from "@commercelayer/sdk"
import { createContext, useEffect, useContext } from "react"
import TagManager from "react-gtm-module"

import { AppContext } from "components/data/AppProvider"

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
interface ItemProps {
  item_id: string | undefined
  item_name: string | undefined
  price: number | undefined
  currency: string | undefined
  quantity: number | undefined
}

interface PushDataLayerProps {
  eventName:
    | "begin_checkout"
    | "add_shipping_info"
    | "add_payment_info"
    | "purchase"
  dataLayer: {
    coupon?: string
    currency: string | undefined
    shipping?: number
    items?: (ItemProps | undefined)[]
    value?: number
    shipping_tier?: string
    transaction_id?: number
    payment_type?: string
    tax?: number
  }
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

  const { accessToken, orderId, slug } = ctx

  const cl = CommerceLayer({
    organization: slug,
    accessToken: accessToken,
  })

  useEffect(() => {
    if (gtmId) {
      TagManager.initialize({ gtmId: gtmId })
      fireBeginCheckout()
    }
  }, [])

  const fetchOrder = async () => {
    return cl.orders.retrieve(orderId, {
      include: [
        "line_items",
        "shipments",
        "shipments.shipping_method",
        "payment_method",
      ],
      fields: {
        number: ["number"],
        coupon_code: ["coupon_code"],
        currency_code: ["currency_code"],
        total_amount_with_taxes_float: ["total_amount_with_taxes_float"],
        shipping_amount_float: ["shipping_amount_float"],
        total_tax_amount_float: ["total_tax_amount_float"],
      },
    })
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
    currency_code,
    sku_code,
    quantity,
    total_amount_float,
  }: LineItem): ItemProps => {
    return {
      item_id: sku_code,
      item_name: name,
      price: total_amount_float,
      currency: currency_code,
      quantity: quantity,
    }
  }

  const fireBeginCheckout = async () => {
    const order = await fetchOrder()
    const lineItems = (
      await cl.orders.retrieve(orderId, {
        fields: {
          sku_code: ["sku_code"],
          name: ["name"],
          total_amount_float: ["total_amount_float"],
          currency_code: ["currency_code"],
          quantity: ["quantity"],
        },
        include: ["line_items"],
      })
    ).line_items

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
    const order = await fetchOrder()
    const shipments = (
      await cl.orders.retrieve(orderId, {
        include: [
          "shipping_method",
          "shipment_line_items",
          "shipment_line_items.line_item",
        ],
      })
    ).shipments

    shipments?.forEach(async (shipment) => {
      const lineItems = shipment
      // .map((e) => e && mapItemsToGTM(e))

      console.log(lineItems)

      return null
      // pushDataLayer({
      //   eventName: "add_shipping_info",
      //   dataLayer: {
      //     coupon: order?.coupon_code,
      //     currency: order?.currency_code,
      //     items: lineItems,
      //     value: shipment.shippingMethod()?.priceAmountForShipmentFloat,
      //     shipping_tier: shipment.shippingMethod()?.name,
      //   },
      // })
    })
  }

  const fireAddPaymentInfo = async () => {
    const order = await fetchOrder()
    // const lineItems = await order
    //   .lineItems()
    //   ?.where({ itemTypeCont: "skus" })
    //   .select(
    //     "sku_code",
    //     "name",
    //     "total_amount_float",
    //     "currency_code",
    //     "quantity"
    //   )
    //   .all()

    // const paymentMethod = order.paymentMethod()

    // return pushDataLayer({
    //   eventName: "add_payment_info",
    //   dataLayer: {
    //     coupon: order?.coupon_code,
    //     currency: order?.currency_code,
    //     items: lineItems?.toArray().map(mapItemsToGTM),
    //     value: paymentMethod?.priceAmountFloat,
    //     payment_type: paymentMethod?.name,
    //   },
    // })
    return null
  }

  const firePurchase = async () => {
    const order = await fetchOrder()
    // const lineItems = await order
    //   .lineItems()
    //   ?.where({ itemTypeCont: "skus" })
    //   .select(
    //     "sku_code",
    //     "name",
    //     "total_amount_float",
    //     "currency_code",
    //     "quantity"
    //   )
    //   .all()

    // return pushDataLayer({
    //   eventName: "purchase",
    //   dataLayer: {
    //     coupon: order?.coupon_code,
    //     currency: order?.currency_code,
    //     items: lineItems?.toArray().map(mapItemsToGTM),
    //     transaction_id: order?.number,
    //     shipping: order?.shipping_amount_float,
    //     value: order?.total_amount_with_taxes_float,
    //     tax: order?.total_tax_amount_float,
    //   },
    // })
    return null
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
