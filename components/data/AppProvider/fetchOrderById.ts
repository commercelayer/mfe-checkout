import CLayer, {
  AddressCollection,
  Order,
  OrderCollection,
  CustomerAddressCollection,
  ShippingMethod,
} from "@commercelayer/js-sdk"

import { changeLanguage } from "components/data/i18n"

interface FetchOrderByIdProps {
  orderId: string
  accessToken: string
}

interface IsNewAddressProps {
  address: AddressCollection | null
  customerAddresses: Array<CustomerAddressCollection> | undefined
  isGuest: boolean
}

interface CheckAndSetDefaultAddressForOrderProps {
  order: OrderCollection
  customerAddresses: Array<CustomerAddressCollection>
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
  shipments: Array<ShipmentSelected>
  hasPaymentMethod: boolean
  hasCustomerAddresses: boolean
  shippingCountryCodeLock: string
}

async function isNewAddress({
  address,
  customerAddresses,
  isGuest,
}: IsNewAddressProps) {
  if (isGuest) {
    return true
  }

  const hasAddressIntoAddresses = Boolean(
    customerAddresses?.find(({ id }) => id === address?.reference)
  )

  if (
    !hasAddressIntoAddresses &&
    customerAddresses &&
    customerAddresses?.length > 1 &&
    Boolean(address)
  ) {
    return true
  }
  if (
    !hasAddressIntoAddresses &&
    customerAddresses &&
    customerAddresses?.length > 1 &&
    Boolean(!address)
  ) {
    return false
  }
  return !hasAddressIntoAddresses
}

async function checkAndSetDefaultAddressForOrder({
  order,
  customerAddresses,
}: CheckAndSetDefaultAddressForOrderProps) {
  if (
    !!order.shippingCountryCodeLock &&
    order.shippingCountryCodeLock !==
      customerAddresses[0].address()?.countryCode
  ) {
    return
  }

  const addressId = customerAddresses[0].address()?.id
  const customerAddressId = customerAddresses[0].id

  const updateObjet: Partial<Record<string, string>> = {
    _billingAddressCloneId: addressId,
    _shippingAddressCloneId: addressId,
  }
  try {
    await order
      .update(updateObjet)
      .then(async function (orderObj: OrderCollection) {
        const billingAddressToUpdate = await orderObj.billingAddress()
        const shippingAddressToUpdate = orderObj.shippingAddress()
        if (billingAddressToUpdate) {
          billingAddressToUpdate.update({
            reference: customerAddressId,
          })
        }
        if (shippingAddressToUpdate) {
          shippingAddressToUpdate.update({
            reference: customerAddressId,
          })
        }
      })
  } catch (error) {
    console.log(error)
  }
}

interface IsBillingAddresSameAsShippingAddressProps {
  billingAddress: AddressCollection | null
  shippingAddress: AddressCollection | null
}

function isBillingAddresSameAsShippingAddress({
  billingAddress,
  shippingAddress,
}: IsBillingAddresSameAsShippingAddressProps) {
  if (shippingAddress && billingAddress) {
    if (
      (shippingAddress.reference === billingAddress.reference &&
        shippingAddress.reference !== null) ||
      shippingAddress.name === billingAddress.name
    ) {
      return true
    } else if (
      shippingAddress.reference !== billingAddress.reference ||
      shippingAddress.name !== billingAddress.name
    ) {
      return false
    }
  } else if (shippingAddress === undefined && billingAddress) {
    return true
  } else if (billingAddress === undefined && shippingAddress) {
    return false
  } else {
    return true
  }
  return true
}

export const fetchOrderById = async ({
  orderId,
  accessToken,
}: FetchOrderByIdProps): Promise<FetchOrderByIdResponse> => {
  CLayer.init({
    accessToken: accessToken,
    endpoint: `${process.env.NEXT_CLAYER_DOMAIN}`,
  })

  try {
    const fetchOrder = async () => {
      return Order.includes(
        "shipping_address",
        "billing_address",
        "shipments",
        "shipments.shipping_method",
        "payment_method",
        "customer",
        "customer.customer_addresses",
        "customer.customer_addresses.address"
      ).find(orderId)
    }

    let order: OrderCollection = await fetchOrder()

    const fetchShipments = async () => {
      return (
        await order.shipments()?.includes("shipping_method").load()
      )?.toArray()
    }

    const isGuest = Boolean(order.guest)

    const customer = isGuest ? undefined : order.customer()
    const addresses = customer && customer.customerAddresses()
    const arrayAddresses = addresses?.toArray()

    let shippingAddress = order.shippingAddress()
    let billingAddress = await order.billingAddress()

    const shippingCountryCodeLock = order.shippingCountryCodeLock

    // If we have a customer with a single customer address and
    // the order has no billing or shipping address, we are going
    // to assume the customer address as the default one
    if (
      !isGuest &&
      arrayAddresses &&
      arrayAddresses.length === 1 &&
      !shippingAddress &&
      !billingAddress
    ) {
      try {
        await checkAndSetDefaultAddressForOrder({
          order: order,
          customerAddresses: arrayAddresses,
        })
        const orderUpdated = await Order.includes(
          "shipping_address",
          "billing_address"
        ).find(orderId)
        shippingAddress = orderUpdated.shippingAddress()
        billingAddress = await orderUpdated.billingAddress()
      } catch {
        console.log("error updating customer address as default for order")
      }
    }

    const hasShippingAddress = Boolean(shippingAddress)
    const hasBillingAddress = Boolean(billingAddress)

    const hasCustomerAddresses =
      (arrayAddresses && arrayAddresses.length >= 1) || false

    const hasEmailAddress = Boolean(order.customerEmail)
    const emailAddress = order.customerEmail

    const shippingMethodsAvailable = (await ShippingMethod.all()).toArray()
    let shipments = await fetchShipments()
    const shipmentsSelected = shipments?.map((a) => {
      return {
        shipmentId: a.id,
        shippingMethodId: a.shippingMethod()?.id,
      }
    })

    const shippingMethods = shipmentsSelected?.map(
      (a: ShipmentSelected) => a.shippingMethodId
    )

    let hasShippingMethod = Boolean(!shippingMethods?.includes(undefined))

    // If billing and shipping addresses are set, we have only
    // a shipping method per shipment, we set it to all shipments.
    // If all promises are successful, we set hasShippingMethod
    // to true to skip the shipping step
    if (
      hasBillingAddress &&
      hasShippingAddress &&
      !hasShippingMethod &&
      shippingMethodsAvailable.length === 1 &&
      shipments &&
      shipments.length > 0
    ) {
      const shippingMethod = shippingMethodsAvailable[0]
      try {
        await Promise.all(
          shipments?.map(async (shipment) => {
            return shipment.update({ shippingMethod })
          })
        )
        hasShippingMethod = true
      } catch {
        console.log("error updating shipments")
      }
    }

    const hasPaymentMethod = false // Boolean(await order.paymentMethod())

    const isUsingNewBillingAddress = await isNewAddress({
      address: billingAddress,
      customerAddresses: arrayAddresses,
      isGuest,
    })
    const isUsingNewShippingAddress = await isNewAddress({
      address: shippingAddress,
      customerAddresses: arrayAddresses,
      isGuest,
    })

    const hasSameAddresses = isBillingAddresSameAsShippingAddress({
      billingAddress,
      shippingAddress,
    })

    console.log("order.shippingAddress :>> ", order.shippingAddress())
    console.log("order.billingAddress :>> ", await order.billingAddress())
    console.log("order.shipments :>> ", shipments)
    console.log("order.paymentMethod :>> ", await order.paymentMethod())

    await changeLanguage(order.languageCode)

    return {
      isGuest,
      hasCustomerAddresses,
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
      shipments: (shipmentsSelected as unknown) as ShipmentSelected[],
      hasPaymentMethod,
      shippingCountryCodeLock,
    }
  } catch (e) {
    console.log(`error on retrieving order: ${e}`)
    return {
      isGuest: false,
      hasCustomerAddresses: false,
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
      shipments: [],
      hasPaymentMethod: false,
      shippingCountryCodeLock: "",
    }
  }
}
