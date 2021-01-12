import CLayer, { Order } from "@commercelayer/js-sdk"

interface FetchOrderByIdProps {
  orderId: string
  accessToken: string
}

interface FetchOrderByIdResponse {
  isGuest: boolean
  hasEmailAddress: boolean
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

    const isGuest = Boolean(order.guest)
    const hasEmailAddress = Boolean(order.customerEmail)
    const hasShippingAddress = Boolean(order.shippingAddress())
    const hasBillingAddress = Boolean(await order.billingAddress())
    const hasShippingMethod = Boolean(order.shipments())
    const hasPaymentMethod = Boolean(await order.paymentMethod())

    // DEBUG
    console.log("order.shippingAddress :>> ", order.shippingAddress())
    console.log("order.billingAddress :>> ", await order.billingAddress())
    console.log("order.shipments :>> ", order.shipments())
    console.log("order.paymentMethod :>> ", await order.paymentMethod())

    return {
      isGuest,
      hasEmailAddress,
      hasShippingAddress,
      hasBillingAddress,
      hasShippingMethod,
      hasPaymentMethod,
    }
  } catch (e) {
    console.log(`error on retrieving order: ${e}`)
    return {
      isGuest: false,
      hasEmailAddress: false,
      hasShippingAddress: false,
      hasBillingAddress: false,
      hasShippingMethod: false,
      hasPaymentMethod: false,
    }
  }
}
