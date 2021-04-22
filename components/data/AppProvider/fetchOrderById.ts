import CLayer, {
  AddressCollection,
  Order,
  OrderCollection,
  CustomerAddressCollection,
  ShippingMethod,
  PaymentMethodCollection,
  PaymentMethod,
} from "@commercelayer/js-sdk"
import i18n from "i18next"

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
  paymentMethod: PaymentMethodCollection | null
  shipments: Array<ShipmentSelected>
  hasPaymentMethod: boolean
  hasCustomerAddresses: boolean
  shippingCountryCodeLock: string
  isShipmentRequired: boolean
  isPaymentRequired: boolean
  isComplete: boolean
  returnUrl: string
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
          await billingAddressToUpdate.update({
            reference: customerAddressId,
          })
        }
        if (shippingAddressToUpdate) {
          await shippingAddressToUpdate.update({
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

async function checkIfShipmentRequired(
  order: OrderCollection
): Promise<boolean> {
  const lineItems = await order
    .lineItems()
    ?.where({ itemTypeCont: "skus" })
    .select("item_type")
    .last(1)
  if (lineItems === undefined) {
    return false
  }
  return lineItems.length > 0
}

export const fetchOrderById = async ({
  orderId,
  accessToken,
}: FetchOrderByIdProps): Promise<FetchOrderByIdResponse> => {
  CLayer.init({
    accessToken: accessToken,
    endpoint: `${process.env.NEXT_PUBLIC_CLAYER_DOMAIN}`,
  })

  try {
    const fetchOrder = async () => {
      return Order.includes(
        "shipping_address",
        "billing_address",
        "shipments",
        "shipments.shipping_method",
        "payment_method",
        "payment_source",
        "customer",
        "customer.customer_addresses",
        "customer.customer_addresses.address"
      ).find(orderId)
    }

    let order: OrderCollection = await fetchOrder()

    const isShipmentRequired = await checkIfShipmentRequired(order)

    const fetchShipments = async () => {
      return (
        await order.shipments()?.includes("shipping_method").load()
      )?.toArray()
    }

    const isPaymentRequired = !(order.totalAmountWithTaxesFloat === 0)

    const isGuest = Boolean(order.guest)

    const customer = isGuest ? undefined : order.customer()
    const addresses = customer && customer.customerAddresses()
    const arrayAddresses = addresses?.toArray()

    let billingAddress = await order.billingAddress()
    let shippingAddress = order.shippingAddress()

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
        order = await fetchOrder()
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

    const shippingMethodsAvailable = isShipmentRequired
      ? (await ShippingMethod.all()).toArray()
      : []
    const shipments = isShipmentRequired ? await fetchShipments() : []
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
      isShipmentRequired &&
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

    const paymentMethod = order.paymentMethod()
    const paymentSource = order.paymentSource()
    let hasPaymentMethod = Boolean(paymentMethod && paymentSource)

    if (!hasPaymentMethod && !isPaymentRequired) {
      hasPaymentMethod = true
    }

    const allAvailablePaymentMethods = (await PaymentMethod.all())
      .toArray()
      .filter(({ disabledAt }) => disabledAt === null)

    // If we have a customer with a single payment method
    // the payment method is automatically selected
    // to assume the payment method as the default one
    if (
      //! isGuest &&
      isPaymentRequired &&
      !hasPaymentMethod &&
      allAvailablePaymentMethods.length === 1
    ) {
      try {
        const paymentMethod = PaymentMethod.build({
          id: allAvailablePaymentMethods[0].id,
        })

        await (await Order.find(order.id)).update({
          paymentMethod,
        })

        // order.available_Customer_payment_sources
      } catch (error) {
        console.log(error)
      }
    }

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

    const isComplete = Boolean(!order.placeable)

    const returnUrl = order.returnUrl

    console.log("order.shippingAddress :>> ", order.shippingAddress())
    console.log("order.billingAddress :>> ", await order.billingAddress())
    console.log("order.shipments :>> ", shipments)
    console.log("order.paymentMethod :>> ", await order.paymentMethod())

    await i18n.changeLanguage(order.languageCode)

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
      paymentMethod,
      shipments: (shipmentsSelected as unknown) as ShipmentSelected[],
      hasPaymentMethod,
      shippingCountryCodeLock,
      isShipmentRequired,
      isPaymentRequired,
      isComplete,
      returnUrl,
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
      paymentMethod: null,
      hasPaymentMethod: false,
      shippingCountryCodeLock: "",
      isShipmentRequired: true,
      isPaymentRequired: true,
      isComplete: false,
      returnUrl: "",
    }
  }
}
