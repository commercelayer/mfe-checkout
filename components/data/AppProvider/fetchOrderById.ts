import CLayer, { Order } from "@commercelayer/js-sdk"

import { changeLanguage } from "components/data/i18n"

interface FetchOrderByIdProps {
  orderId: string
  accessToken: string
}

interface FetchOrderByIdResponse {
  hasShippingAddress: boolean
  hasBillingAddress: boolean
  hasShippingMethod: boolean
  hasPaymentMethod: boolean
}

export const fetchOrderById = async ({
  orderId,
  accessToken,
}: FetchOrderByIdProps): Promise<FetchOrderByIdResponse> => {
  CLayer.init({
    accessToken: accessToken,
    endpoint: `${process.env.NEXT_PUBLIC_API_DOMAIN}`,
  })

  try {
    const order = await Order.includes(
      "shipping_address",
      "billing_address",
      "shipments",
      "payment_method"
    ).find(orderId)

    changeLanguage(order.languageCode)

    const hasShippingAddress = Boolean(order.shippingAddress())
    const hasBillingAddress = Boolean(await order.billingAddress())
    const hasShippingMethod = Boolean(order.shipments())
    const hasPaymentMethod = Boolean(await order.paymentMethod())

    return {
      hasShippingAddress,
      hasBillingAddress,
      hasShippingMethod,
      hasPaymentMethod,
    }
  } catch (e) {
    console.log(`error on retrieving order: ${e}`)
    return {
      hasShippingAddress: false,
      hasBillingAddress: false,
      hasShippingMethod: false,
      hasPaymentMethod: false,
    }
  }
}
