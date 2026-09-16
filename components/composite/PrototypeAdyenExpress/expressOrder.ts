/**
 * PROTOTYPE — throwaway code, see README.md
 */
import type {
  AdyenPayment,
  CommerceLayerClient,
  Order,
  PaymentMethod,
  QueryParamsRetrieve,
  Shipment,
  ShippingMethod,
} from "@commercelayer/sdk"

import type { ExpressContact, ExpressShippingMethod } from "./types"
import { PROTOTYPE_BILLING_INFO, toAddressAttributes } from "./utils"

export const ADYEN_PAYMENT_SOURCE_TYPE = "adyen_payments"

const EXPRESS_ORDER_QUERY: QueryParamsRetrieve<Order> = {
  fields: {
    orders: [
      "id",
      "status",
      "guest",
      "country_code",
      "shipping_country_code_lock",
      "currency_code",
      "language_code",
      "customer_email",
      "requires_billing_info",
      "subtotal_amount_float",
      "discount_amount_float",
      "shipping_amount_float",
      "total_tax_amount_float",
      "gift_card_amount_float",
      "total_amount_with_taxes_cents",
      "total_amount_with_taxes_float",
      "available_payment_methods",
      "payment_method",
      "payment_source",
      "shipments",
      "shipping_address",
      "billing_address",
    ],
    payment_methods: ["id", "name", "payment_source_type"],
    shipments: ["id", "shipping_method", "available_shipping_methods"],
    shipping_methods: [
      "id",
      "name",
      "price_amount_for_shipment_float",
      "formatted_price_amount_for_shipment",
    ],
    addresses: ["id", "reference"],
  },
  include: [
    "available_payment_methods",
    "payment_method",
    "payment_source",
    "shipments",
    "shipments.shipping_method",
    "shipments.available_shipping_methods",
    "shipping_address",
    "billing_address",
  ],
}

export function fetchExpressOrder(cl: CommerceLayerClient, orderId: string) {
  return cl.orders.retrieve(orderId, EXPRESS_ORDER_QUERY)
}

export function findAdyenPaymentMethod(
  order: Order,
): NullableType<PaymentMethod> {
  return order.available_payment_methods?.find(
    (paymentMethod) =>
      paymentMethod.payment_source_type === ADYEN_PAYMENT_SOURCE_TYPE,
  )
}

/**
 * Selects Adyen as payment method for the order and creates the payment
 * source, which is what carries the Adyen client key and the list of payment
 * methods enabled for this order (country + amount).
 */
export async function createAdyenPaymentSource(
  cl: CommerceLayerClient,
  { order, paymentMethod }: { order: Order; paymentMethod: PaymentMethod },
): Promise<AdyenPayment> {
  if (order.payment_method?.id !== paymentMethod.id) {
    await cl.orders.update({
      id: order.id,
      payment_method: cl.payment_methods.relationship(paymentMethod.id),
    })
  }

  return await cl.adyen_payments.create({
    order: cl.orders.relationship(order.id),
  })
}

/**
 * Addresses created by the checkout itself (no `reference`) are updated in
 * place, the same way the address step does it, so that we don't pile up a new
 * address record every time the shopper changes contact in the wallet sheet.
 */
async function saveAddress(
  cl: CommerceLayerClient,
  {
    order,
    contact,
    resource,
  }: {
    order: Order
    contact: ExpressContact
    resource: "billing_address" | "shipping_address"
  },
): Promise<void> {
  const attributes = {
    ...toAddressAttributes({
      ...contact,
    }),
    // Markets that require billing info need it on every address, including the
    // copy made by `_billing_address_same_as_shipping`, and no wallet sheet
    // collects a VAT number or codice fiscale. A placeholder keeps the flow
    // moving; production collects this from the shopper.
    billing_info: PROTOTYPE_BILLING_INFO,
  }
  const currentAddress = order[resource]

  // Updating the record the order already points at keeps the shipments, and
  // with them the shipping method chosen in the wallet sheet. Attaching a
  // different address recreates them, as does `_refresh` — which isn't needed
  // here, since the order autorefreshes.
  if (currentAddress?.id != null && currentAddress?.reference == null) {
    await cl.addresses.update({ id: currentAddress.id, ...attributes })

    // No `_refresh` and no read back: the caller fetches once when it is done.
    return
  }

  const address = await cl.addresses.create(attributes)

  await cl.orders.update({
    id: order.id,
    [resource]: cl.addresses.relationship(address.id),
  })
}

export async function saveExpressShippingAddress(
  cl: CommerceLayerClient,
  { order, contact }: { order: Order; contact: ExpressContact },
): Promise<Order> {
  await saveAddress(cl, { order, contact, resource: "shipping_address" })

  // Taxes need a billing address too: until the wallet hands us the real one
  // we mirror the shipping address. This must never abort the caller — the
  // wallet is waiting for shipping methods, and the real billing address is
  // written at authorization anyway.
  if (order.billing_address == null) {
    try {
      await cl.orders.update({
        id: order.id,
        _billing_address_same_as_shipping: true,
      })
    } catch (e) {
      console.error("Adyen express prototype: cannot mirror billing address", e)
    }
  }

  return await fetchExpressOrder(cl, order.id)
}

export async function saveExpressBillingAddress(
  cl: CommerceLayerClient,
  { order, contact }: { order: Order; contact: ExpressContact },
): Promise<Order> {
  await saveAddress(cl, { order, contact, resource: "billing_address" })

  return await fetchExpressOrder(cl, order.id)
}

export async function saveCustomerEmail(
  cl: CommerceLayerClient,
  { order, email }: { order: Order; email: string },
): Promise<Order> {
  if (order.customer_email === email) {
    return order
  }
  await cl.orders.update({ id: order.id, customer_email: email })

  return await fetchExpressOrder(cl, order.id)
}

function availableMethodsFor(shipment: Shipment): ShippingMethod[] {
  return shipment.available_shipping_methods ?? []
}

/**
 * Wallets show a single list of shipping methods while an order can have many
 * shipments, so methods are grouped by name and priced as the sum of what each
 * shipment charges for that name.
 */
export function listShippingMethods(order: Order): ExpressShippingMethod[] {
  const shipments = order.shipments ?? []
  const names = new Set<string>()

  for (const shipment of shipments) {
    for (const method of availableMethodsFor(shipment)) {
      names.add(method.name)
    }
  }

  return [...names].map((name) => {
    const methods = shipments.map((shipment) =>
      methodForShipment(shipment, name),
    )
    const amount = methods.reduce(
      (total, method) => total + (method?.price_amount_for_shipment_float ?? 0),
      0,
    )

    return {
      identifier: name,
      label: name,
      detail: methods[0]?.formatted_price_amount_for_shipment ?? "",
      amount: amount.toFixed(2),
    }
  })
}

function methodForShipment(
  shipment: Shipment,
  name?: string,
): NullableType<ShippingMethod> {
  const methods = availableMethodsFor(shipment)

  return methods.find((method) => method.name === name) ?? methods[0]
}

/**
 * Applies the shipping method with the given name to every shipment, falling
 * back to the first available one for shipments that don't offer it.
 */
export async function applyShippingMethod(
  cl: CommerceLayerClient,
  { order, identifier }: { order: Order; identifier?: string },
): Promise<Order> {
  const shipments = order.shipments ?? []

  for (const shipment of shipments) {
    const method = methodForShipment(shipment, identifier)

    if (method == null || shipment.shipping_method?.id === method.id) {
      continue
    }
    await cl.shipments.update({
      id: shipment.id,
      shipping_method: cl.shipping_methods.relationship(method.id),
    })
  }

  return await fetchExpressOrder(cl, order.id)
}

/**
 * True when a shipment cannot be served as it stands: no methods available for
 * the location, or an applied method that is no longer among them.
 *
 * Availability is recalculated from the shipping zone whenever the location
 * changes, so this is the check to run once the real address is in — before
 * placing an order that could not ship.
 */
export function hasUnservedShipment(order: Order): boolean {
  return (order.shipments ?? []).some((shipment) => {
    const available = shipment.available_shipping_methods ?? []

    return (
      available.length === 0 ||
      !available.some((method) => method.id === shipment.shipping_method?.id)
    )
  })
}

export function updatePaymentRequestData(
  cl: CommerceLayerClient,
  {
    paymentSourceId,
    paymentRequestData,
  }: { paymentSourceId: string; paymentRequestData: Record<string, unknown> },
) {
  return cl.adyen_payments.update({
    id: paymentSourceId,
    payment_request_data: paymentRequestData,
  })
}

export function authorizeAdyenPayment(
  cl: CommerceLayerClient,
  paymentSourceId: string,
) {
  return cl.adyen_payments.update({ id: paymentSourceId, _authorize: true })
}

export function sendAdyenPaymentDetails(
  cl: CommerceLayerClient,
  {
    paymentSourceId,
    details,
  }: { paymentSourceId: string; details: Record<string, unknown> },
) {
  return cl.adyen_payments.update({
    id: paymentSourceId,
    payment_request_details: details,
    _details: true,
  })
}

export function placeExpressOrder(cl: CommerceLayerClient, orderId: string) {
  return cl.orders.update({ id: orderId, _place: true })
}
