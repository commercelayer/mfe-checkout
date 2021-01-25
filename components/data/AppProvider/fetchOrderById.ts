import CLayer, {
  AddressCollection,
  Order,
  OrderCollection,
  CustomerAddressCollection,
} from "@commercelayer/js-sdk"

import { changeLanguage } from "components/data/i18n"

interface FetchOrderByIdProps {
  orderId: string
  accessToken: string
}

export interface FetchOrderByIdResponse {
  isGuest: boolean
  isUsingNewBillingAddress: boolean
  isUsingNewShippingAddress: boolean
  hasSameAddresses: boolean
  hasEmailAddress: boolean
  emailAddress: string
  hasShippingAddress: boolean
  shippingAddress: AddressCollection | null
  hasBillingAddress: boolean
  billingAddress: AddressCollection | null
  hasShippingMethod: boolean
  hasPaymentMethod: boolean
}

async function isNewAddress(
  address: AddressCollection | null,
  isGuest: boolean,
  order: OrderCollection
) {
  if (isGuest) {
    return true
  }

  const customer = await order.customer()
  const addresses = customer.customerAddresses()

  const arrayAddresses = addresses.toArray()

  const hasAddressIntoAddresses = arrayAddresses.some(
    (o) => o.name !== address?.name
  )

  return hasAddressIntoAddresses
}

async function setOrderAddressDefault(
  order: OrderCollection,
  arrayAddresses: Array<CustomerAddressCollection>,
  hasShippingAddress: boolean,
  hasBillingAddress: boolean
) {
  if (
    arrayAddresses.length === 1 &&
    !hasShippingAddress &&
    !hasBillingAddress
  ) {
    const address = arrayAddresses[0].address().id
    const updateObjet: Partial<Record<string, any>> = {
      _billingAddressCloneId: address,
      _shippingAddressCloneId: address,
    }
    try {
      await order.update(updateObjet)
    } catch (error) {
      console.log(error)
    }
  }
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
      "payment_method",
      "customer",
      "customer.customer_addresses",
      "customer.customer_addresses.address"
    ).find(orderId)

    const customer = order.customer()
    const addresses = customer.customerAddresses()
    const arrayAddresses = addresses.toArray()

    const shippingAddress = order.shippingAddress()
    const hasShippingAddress = Boolean(order.shippingAddress())

    const billingAddress = await order.billingAddress()
    const hasBillingAddress = Boolean(billingAddress)

    const isGuest = Boolean(order.guest)
    const hasEmailAddress = Boolean(order.customerEmail)
    const emailAddress = order.customerEmail
    const hasShippingMethod = Boolean(order.shipments())
    const hasPaymentMethod = Boolean(await order.paymentMethod())

    const isUsingNewBillingAddress = await isNewAddress(
      billingAddress,
      isGuest,
      order
    )
    const isUsingNewShippingAddress = await isNewAddress(
      shippingAddress,
      isGuest,
      order
    )

    const hasSameAddresses = shippingAddress?.name === billingAddress?.name

    console.log("order.shippingAddress :>> ", order.shippingAddress())
    console.log("order.billingAddress :>> ", await order.billingAddress())
    console.log("order.shipments :>> ", order.shipments())
    console.log("order.paymentMethod :>> ", await order.paymentMethod())

    await setOrderAddressDefault(
      order,
      arrayAddresses,
      hasShippingAddress,
      hasBillingAddress
    )

    changeLanguage(order.languageCode)

    return {
      isGuest,
      isUsingNewBillingAddress,
      isUsingNewShippingAddress,
      hasSameAddresses,
      hasEmailAddress,
      emailAddress,
      hasShippingAddress,
      shippingAddress,
      hasBillingAddress,
      billingAddress,
      hasShippingMethod,
      hasPaymentMethod,
    }
  } catch (e) {
    console.log(`error on retrieving order: ${e}`)
    return {
      isGuest: false,
      isUsingNewBillingAddress: true,
      isUsingNewShippingAddress: true,
      hasSameAddresses: false,
      hasEmailAddress: false,
      emailAddress: "",
      hasShippingAddress: false,
      shippingAddress: null,
      hasBillingAddress: false,
      billingAddress: null,
      hasShippingMethod: false,
      hasPaymentMethod: false,
    }
  }
}
