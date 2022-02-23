import { TypeAccepted } from "@commercelayer/react-components/lib/utils/getLineItemsCount"
import CommerceLayer, {
  Order,
  Address,
  CustomerAddress,
  PaymentMethod,
  CommerceLayerClient,
  OrderUpdate,
  StripePayment,
  WireTransfer,
  AdyenPayment,
  BraintreePayment,
  CheckoutComPayment,
  ExternalPayment,
  PaypalPayment,
  ShippingMethod,
  Shipment,
} from "@commercelayer/sdk"
import { changeLanguage } from "i18next"

import { LINE_ITEMS_SHIPPABLE } from "components/utils/constants"

import { AppStateData } from "."

interface FetchOrderByIdProps {
  orderId: string
  accessToken: string
  slug: string
  domain: string
}

interface IsNewAddressProps {
  address: Address | undefined
  customerAddresses: Array<CustomerAddress> | undefined
  isGuest: boolean
}

interface CheckAndSetDefaultAddressForOrderProps {
  cl: CommerceLayerClient
  order: Order
  customerAddresses?: Array<CustomerAddress>
}

export interface FetchOrderByIdResponse {
  isGuest: boolean
  isUsingNewBillingAddress: boolean
  isUsingNewShippingAddress: boolean
  hasSameAddresses: boolean
  hasEmailAddress: boolean
  customerAddresses: CustomerAddress[]
  emailAddress: string | undefined
  hasShippingAddress: boolean
  shippingAddress: Address | undefined
  hasBillingAddress: boolean
  billingAddress: Address | undefined
  requiresBillingInfo: boolean | undefined
  hasShippingMethod: boolean
  paymentMethod: PaymentMethod | undefined
  shipments: Array<ShipmentSelected>
  hasPaymentMethod: boolean
  hasCustomerAddresses: boolean
  shippingCountryCodeLock: string | undefined
  isShipmentRequired: boolean
  isPaymentRequired: boolean
  isComplete: boolean
  returnUrl: string | undefined
  isCreditCard: boolean
  taxIncluded: boolean | undefined
}

function isNewAddress({
  address,
  customerAddresses,
  isGuest,
}: IsNewAddressProps): boolean {
  if (isGuest) {
    return true
  }

  const hasAddressIntoAddresses = Boolean(
    customerAddresses?.find(
      (customerAddress) =>
        customerAddress.address?.reference === address?.reference
    )
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

export async function checkAndSetDefaultAddressForOrder({
  cl,
  order,
}: CheckAndSetDefaultAddressForOrderProps) {
  const customerAddresses = order?.customer?.customer_addresses
  if (
    order.guest ||
    !customerAddresses ||
    (customerAddresses && customerAddresses.length !== 1) ||
    order.billing_address ||
    order.shipping_address
  ) {
    return {}
  }

  if (
    !!order.shipping_country_code_lock &&
    order.shipping_country_code_lock !==
      customerAddresses[0].address?.country_code
  ) {
    return {}
  }

  let addressId = customerAddresses[0].address?.id

  if (addressId) {
    addressId = (
      await cl.addresses.update({
        id: addressId,
        reference: addressId,
      })
    ).id
  }

  const updateObjet: OrderUpdate = {
    id: order.id,
    _billing_address_clone_id: addressId,
    _shipping_address_clone_id: addressId,
  }
  try {
    const orderObj = await cl.orders.update(updateObjet, {
      include: ["billing_address", "shipping_address"],
    })

    const billingAddressToUpdate = orderObj.billing_address?.id
    const shippingAddressToUpdate = orderObj.shipping_address?.id
    const updatedOrder = await cl.orders.update(
      {
        id: order.id,
        ...(billingAddressToUpdate &&
          addressId && {
            billing_address: {
              id: addressId,
              type: "addresses",
            },
          }),
        ...(shippingAddressToUpdate &&
          addressId && {
            shipping_address: {
              id: addressId,
              type: "addresses",
            },
          }),
      },
      { include: ["billing_address", "shipping_address"] }
    )
    localStorage.setItem(
      "_save_billing_address_to_customer_address_book",
      "false"
    )
    localStorage.setItem(
      "_save_shipping_address_to_customer_address_book",
      "false"
    )
    return {
      hasSameAddresses: true,
      hasBillingAddress: true,
      hasShippingAddress: true,
      isUsingNewBillingAddress: false,
      isUsingNewShippingAddress: false,
      billingAddress: updatedOrder.billing_address,
      shippingAddress: updatedOrder.shipping_address,
    }
  } catch (error) {
    console.log(error)
    return {}
  }
}

interface IsBillingAddresSameAsShippingAddressProps {
  billingAddress: Address | undefined
  shippingAddress: Address | undefined
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

export const fetchOrder = async (cl: CommerceLayerClient, orderId: string) => {
  return cl.orders.retrieve(orderId, {
    fields: {
      orders: [
        "id",
        "guest",
        "shipping_country_code_lock",
        "customer_email",
        "status",
        "return_url",
        "tax_included",
        "requires_billing_info",
        "total_amount_with_taxes_float",
        "language_code",
        "shipping_address",
        "billing_address",
        "shipments",
        "payment_method",
        "payment_source",
        "customer",
      ],
      shipments: ["shipping_method"],
      customer: ["customer_addresses"],
      customer_addresses: ["address"],
    },
    include: [
      "shipping_address",
      "billing_address",
      "shipments",
      "shipments.shipping_method",
      "payment_method",
      "payment_source",
      "customer",
      "customer.customer_addresses",
      "customer.customer_addresses.address",
    ],
  })
}

export async function checkIfShipmentRequired(
  cl: CommerceLayerClient,
  orderId: string
): Promise<boolean> {
  const lineItems = (
    await cl.orders.retrieve(orderId, {
      fields: {
        line_items: ["item_type", "item"],
      },
      include: ["line_items", "line_items.item"],
    })
  ).line_items?.filter(
    (line_item) =>
      LINE_ITEMS_SHIPPABLE.includes(line_item.item_type as TypeAccepted) &&
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      !line_item.item?.do_not_ship
  )

  if (lineItems?.length === undefined) {
    return false
  }
  // riguardare
  return lineItems.length > 0
}

export const fetchOrderById = async ({
  orderId,
  accessToken,
  slug,
  domain,
}: FetchOrderByIdProps): Promise<FetchOrderByIdResponse> => {
  const cl = CommerceLayer({
    organization: slug,
    accessToken: accessToken,
    domain,
  })

  console.time("start fetch")
  try {
    const fetchOrder = async () => {
      return cl.orders.retrieve(orderId, {
        fields: {
          orders: [
            "id",
            "guest",
            "shipping_country_code_lock",
            "customer_email",
            "status",
            "return_url",
            "tax_included",
            "requires_billing_info",
            "total_amount_with_taxes_float",
            "language_code",
            "shipping_address",
            "billing_address",
            "shipments",
            "payment_method",
            "payment_source",
            "customer",
          ],
          shipments: ["shipping_method"],
          customer: ["customer_addresses"],
          customer_addresses: ["address"],
        },
        include: [
          "shipping_address",
          "billing_address",
          "shipments",
          "shipments.shipping_method",
          "payment_method",
          "payment_source",
          "customer",
          "customer.customer_addresses",
          "customer.customer_addresses.address",
        ],
      })
    }

    let order: Order = await fetchOrder()

    const isShipmentRequired = await checkIfShipmentRequired(cl, order.id)

    const fetchShipments = async () => {
      return order.shipments
    }

    const isPaymentRequired = !(order.total_amount_with_taxes_float === 0)

    const isGuest = Boolean(order.guest)

    const customer = isGuest ? undefined : order.customer
    const addresses = customer && customer.customer_addresses

    let billingAddress = order.billing_address
    let shippingAddress = order.shipping_address

    const shippingCountryCodeLock = order.shipping_country_code_lock

    let isUsingNewBillingAddress = isNewAddress({
      address: billingAddress,
      customerAddresses: addresses,
      isGuest,
    })
    let isUsingNewShippingAddress = isNewAddress({
      address: shippingAddress,
      customerAddresses: addresses,
      isGuest,
    })

    // If we have a customer with a single customer address and
    // the order has no billing or shipping address, we are going
    // to assume the customer address as the default one
    if (
      !isGuest &&
      addresses &&
      addresses.length === 1 &&
      !shippingAddress &&
      !billingAddress
    ) {
      try {
        await checkAndSetDefaultAddressForOrder({
          cl,
          order: order,
          customerAddresses: addresses,
        })
        // temp fix to resolve flag bug
        localStorage.setItem(
          "_save_billing_address_to_customer_address_book",
          "false"
        )
        localStorage.setItem(
          "_save_shipping_address_to_customer_address_book",
          "false"
        )
        // --
        isUsingNewBillingAddress = false
        isUsingNewShippingAddress = false
        const orderUpdated = await cl.orders.retrieve(order.id, {
          include: ["shipping_address", "billing_address"],
        })
        shippingAddress = orderUpdated.shipping_address
        billingAddress = orderUpdated.billing_address
        order = await fetchOrder()
      } catch {
        console.log("error updating customer address as default for order")
      }
    }

    const hasShippingAddress = Boolean(shippingAddress)
    const hasBillingAddress = Boolean(billingAddress)

    const hasCustomerAddresses = (addresses && addresses.length >= 1) || false

    const hasEmailAddress = Boolean(order.customer_email)
    const emailAddress = order.customer_email

    // const shippingMethodsAvailable = isShipmentRequired
    //   ? (await ShippingMethod.all()).toArray()
    //   : []
    const shipments = isShipmentRequired ? await fetchShipments() : []
    const shipmentsSelected = shipments?.map((a) => {
      return {
        shipmentId: a.id,
        shippingMethodId: a.shipping_method?.id,
        shippingMethodName: a.shipping_method?.name,
      }
    })

    const shippingMethods = shipmentsSelected?.map(
      (a: ShipmentSelected) => a.shippingMethodId
    )

    const hasShippingMethod = isShipmentRequired
      ? Boolean(
          shippingMethods?.length && !shippingMethods?.includes(undefined)
        )
      : true

    // If billing and shipping addresses are set, we have only
    // a shipping method per shipment, we set it to all shipments.
    // If all promises are successful, we set hasShippingMethod
    // to true to skip the shipping step
    /* if (
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
    } */

    const paymentMethod = order.payment_method
    const paymentSource:
      | (AdyenPayment & {
          options?: { card?: string }
          metadata: { card?: string }
        })
      | (BraintreePayment & {
          options?: { card?: string }
          metadata: { card?: string }
        })
      | (CheckoutComPayment & {
          options?: { card?: string }
          metadata: { card?: string }
        })
      | (ExternalPayment & {
          options?: { card?: string }
        })
      | (PaypalPayment & {
          options?: { card?: string }
          metadata: { card?: string }
        })
      | (StripePayment & {
          options?: { card?: string }
          metadata: { card?: string }
        })
      | (WireTransfer & {
          options?: { card?: string }
          metadata: { card?: string }
        })
      | undefined = order.payment_source
    let hasPaymentMethod = Boolean(
      paymentSource?.metadata?.card || paymentSource?.options?.card
    )

    if (!hasPaymentMethod && !isPaymentRequired) {
      hasPaymentMethod = true
    }

    const isCreditCard =
      paymentMethod?.payment_source_type === "adyen_payments" ||
      paymentMethod?.payment_source_type === "stripe_payments" ||
      paymentMethod?.payment_source_type === "braintree_payments"

    const allAvailablePaymentMethods = (
      await cl.payment_methods.list({
        fields: { payment_methods: ["disabled_at", "id"] },
      })
    ).filter(({ disabled_at }) => disabled_at === null)

    // If we have a customer with a single payment method
    // the payment method is automatically selected
    // to assume the payment method as the default one
    if (
      //! isGuest &&
      isPaymentRequired &&
      !hasPaymentMethod &&
      allAvailablePaymentMethods.length === 1 &&
      !order.payment_method?.id
    ) {
      try {
        await cl.orders.update({
          id: order.id,
          payment_method: {
            id: allAvailablePaymentMethods[0].id,
            type: "payment_methods",
          },
        })

        // order.available_Customer_payment_sources
      } catch (error) {
        console.log(error)
      }
    }

    const hasSameAddresses = isBillingAddresSameAsShippingAddress({
      billingAddress,
      shippingAddress,
    })

    const isComplete = order.status === "placed"

    const returnUrl = order.return_url

    const taxIncluded = order.tax_included

    const requiresBillingInfo = order.requires_billing_info

    await changeLanguage(order.language_code)
    console.timeEnd("start fetch")
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
      requiresBillingInfo,
      hasShippingMethod,
      paymentMethod,
      shipments: shipmentsSelected as unknown as ShipmentSelected[],
      hasPaymentMethod,
      shippingCountryCodeLock,
      isShipmentRequired,
      isPaymentRequired,
      customerAddresses: [],
      isCreditCard,
      isComplete,
      returnUrl,
      taxIncluded,
    }
  } catch (e) {
    console.log(`error on retrieving order: ${e}`)
    return {
      isGuest: true,
      hasCustomerAddresses: false,
      isUsingNewBillingAddress: true,
      isUsingNewShippingAddress: true,
      hasSameAddresses: false,
      hasEmailAddress: false,
      emailAddress: "",
      hasShippingAddress: false,
      shippingAddress: undefined,
      hasBillingAddress: false,
      billingAddress: undefined,
      customerAddresses: [],
      requiresBillingInfo: false,
      hasShippingMethod: false,
      shipments: [],
      paymentMethod: undefined,
      hasPaymentMethod: false,
      shippingCountryCodeLock: "",
      isShipmentRequired: true,
      isPaymentRequired: true,
      isCreditCard: false,
      isComplete: false,
      returnUrl: "",
      taxIncluded: false,
    }
  }
}

export function prepareShipments(shipments?: Shipment[]) {
  return (shipments || []).map((a) => {
    return {
      shipmentId: a.id,
      shippingMethodId: a.shipping_method?.id,
      shippingMethodName: a.shipping_method?.name,
    }
  })
}

function isPaymentRequired(order: Order) {
  return !(order.total_amount_with_taxes_float === 0)
}

export function calculateAddresses(
  order: Order,
  addresses?: CustomerAddress[]
): Partial<AppStateData> {
  const cAddresses = addresses || order.customer?.customer_addresses
  const values = {
    hasCustomerAddresses: (cAddresses && cAddresses.length >= 1) || false,
    billingAddress: order.billing_address,
    shippingAddress: order.shipping_address,
    hasBillingAddress: Boolean(order.billing_address),
    hasShippingAddress: Boolean(order.shipping_address),
    addresses: cAddresses,
    isUsingNewBillingAddress: isNewAddress({
      address: order.billing_address,
      customerAddresses: cAddresses,
      isGuest: Boolean(order.guest),
    }),
    isUsingNewShippingAddress: isNewAddress({
      address: order.shipping_address,
      customerAddresses: cAddresses,
      isGuest: Boolean(order.guest),
    }),
    hasSameAddresses: isBillingAddresSameAsShippingAddress({
      billingAddress: order.billing_address,
      shippingAddress: order.shipping_address,
    }),
  }
  return values
}

export function calculateSettings(order: Order) {
  const calculatedAddresses = calculateAddresses(order)
  const paymentRequired = isPaymentRequired(order)
  return {
    isPaymentRequired: paymentRequired,
    hasPaymentMethod: !paymentRequired,
    isGuest: Boolean(order.guest),
    shippingCountryCodeLock: order.shipping_country_code_lock,
    hasEmailAddress: Boolean(order.customer_email),
    emailAddress: order.customer_email,
    customerAddresses: order.customer?.customer_addresses,
    ...calculatedAddresses,
    isComplete: order.status === "placed",
    returnUrl: order.return_url,
    taxIncluded: order.tax_included,
    requiresBillingInfo: order.requires_billing_info,
    shipments: prepareShipments(order.shipments),
  }
}

export function checkPaymentMethod(order: Order) {
  const paymentMethod = order.payment_method

  const paymentSource:
    | (AdyenPayment & {
        options?: { card?: string }
        metadata: { card?: string }
      })
    | (BraintreePayment & {
        options?: { card?: string }
        metadata: { card?: string }
      })
    | (CheckoutComPayment & {
        options?: { card?: string }
        metadata: { card?: string }
      })
    | (ExternalPayment & {
        options?: { card?: string }
      })
    | (PaypalPayment & {
        options?: { card?: string }
        metadata: { card?: string }
      })
    | (StripePayment & {
        options?: { card?: string }
        metadata: { card?: string }
      })
    | (WireTransfer & {
        options?: { card?: string }
        metadata: { card?: string }
      })
    | undefined = order.payment_source

  let hasPaymentMethod = Boolean(
    paymentSource?.metadata?.card || paymentSource?.options?.card
  )

  if (!hasPaymentMethod && !isPaymentRequired(order)) {
    hasPaymentMethod = true
  }

  const isComplete = order.status === "placed"

  const isCreditCard =
    paymentMethod?.payment_source_type === "adyen_payments" ||
    paymentMethod?.payment_source_type === "stripe_payments" ||
    paymentMethod?.payment_source_type === "braintree_payments"

  return {
    isCreditCard,
    hasPaymentMethod,
    paymentMethod,
    isComplete,
    paymentSource,
  }
}

export function calculateSelectedShipments(
  shipments: ShipmentSelected[],
  payload: {
    shipmentId: string
    shippingMethod: ShippingMethod | Record<string, any>
  }
) {
  const shipmentsSelected = shipments?.map((shipment) => {
    return shipment.shipmentId === payload.shipmentId
      ? {
          ...shipment,
          shippingMethodId: payload.shippingMethod.id,
          shippingMethodName: payload.shippingMethod.name,
        }
      : shipment
  })
  const shippingMethods = shipmentsSelected?.map(
    (a: ShipmentSelected) => a.shippingMethodId
  )
  const hasShippingMethod = Boolean(
    shippingMethods?.length && !shippingMethods?.includes(undefined)
  )

  return { shipments: shipmentsSelected, hasShippingMethod }
}
