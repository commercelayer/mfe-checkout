/**
 * PROTOTYPE — throwaway code, see README.md
 */
import { jwtDecode } from "@commercelayer/js-auth"
import type { Order } from "@commercelayer/sdk"

import type { ExpressContact, ExpressTotals } from "./types"

/**
 * Commerce Layer requires a few address fields that wallets don't always give
 * us (or redact until the payment is authorized). We fill them with this
 * placeholder so that taxes and shipping costs can be computed, and overwrite
 * them with the real values as soon as the shopper authorizes the payment.
 */
const PLACEHOLDER = "-"

/**
 * Markets can require billing info (VAT number, codice fiscale) to place an
 * order, and no wallet sheet collects it. The prototype sends a recognisably
 * fake value: production has to ask the shopper for it.
 */
export const PROTOTYPE_BILLING_INFO = "VAT ID IT00000000000 (prototype)"

export interface ExpressTotalsLabels {
  total: string
  subtotal: string
  discount: string
  shipping: string
  taxes: string
  giftCard: string
}

export function browserInfo() {
  const { userAgent, language, javaEnabled } = window.navigator
  const { colorDepth, height, width } = window.screen

  return {
    acceptHeader: "*/*",
    colorDepth,
    javaEnabled:
      typeof javaEnabled === "function" ? javaEnabled.call(navigator) : false,
    language,
    screenHeight: height,
    screenWidth: width,
    timeZoneOffset: new Date().getTimezoneOffset(),
    userAgent,
  }
}

/** Adyen runs in test mode whenever the checkout token is a test token. */
export function adyenEnvironment(accessToken: string): "test" | "live" {
  try {
    const { payload } = jwtDecode(accessToken)

    return "test" in payload && payload.test ? "test" : "live"
  } catch (e) {
    console.error("Adyen express checkout: cannot decode access token", e)
    return "test"
  }
}

/** Current url without the query string, used as Adyen return url. */
export function returnUrl() {
  return window.location.href.split("?")[0]
}

function amountToDecimal(amount: NullableType<number>) {
  return (amount ?? 0).toFixed(2)
}

export function toAddressAttributes(contact: ExpressContact) {
  return {
    first_name: contact.firstName || PLACEHOLDER,
    last_name: contact.lastName || PLACEHOLDER,
    line_1: contact.line1 || PLACEHOLDER,
    line_2: contact.line2 || undefined,
    city: contact.city || PLACEHOLDER,
    zip_code: contact.zipCode || undefined,
    state_code: contact.stateCode || undefined,
    country_code: (contact.countryCode || "").toUpperCase(),
    phone: contact.phone || PLACEHOLDER,
    email: contact.email || undefined,
  }
}

/** Apple Pay gives us the full contact only once the payment is authorized. */
export function contactFromApplePay(contact: any): ExpressContact {
  const [line1, line2] = contact?.addressLines ?? []

  return {
    firstName: contact?.givenName,
    lastName: contact?.familyName,
    line1,
    line2,
    city: contact?.locality,
    zipCode: contact?.postalCode,
    stateCode: contact?.administrativeArea,
    countryCode: contact?.countryCode,
    phone: contact?.phoneNumber,
    email: contact?.emailAddress,
  }
}

/** Google Pay redacts everything but the area while the sheet is open. */
export function contactFromGooglePay(
  address: any,
  extra?: { email?: NullableType<string> },
): ExpressContact {
  const [firstName, ...lastName] = (address?.name ?? "").split(" ")

  return {
    firstName,
    lastName: lastName.join(" "),
    line1: address?.address1,
    line2: [address?.address2, address?.address3].filter(Boolean).join(" "),
    city: address?.locality,
    zipCode: address?.postalCode,
    stateCode: address?.administrativeArea,
    countryCode: address?.countryCode,
    phone: address?.phoneNumber,
    email: extra?.email,
  }
}

/**
 * Country of the wallet session. The order is locked to a shipping country
 * whenever the market defines one, which is known before the shopper gives us
 * any address, so it wins over the order country.
 */
export function expressCountryCode(order: Order) {
  const countryCode = "HK" // ?? order.shipping_country_code_lock ?? order.country_code ?? ""

  return countryCode.toUpperCase() || undefined
}

export function expressAmount(order: Order) {
  return {
    value: order.total_amount_with_taxes_cents ?? 0,
    currency: order.currency_code ?? "",
  }
}

export function expressTotals(
  order: Order,
  labels: ExpressTotalsLabels,
): ExpressTotals {
  const lineItems = [
    { label: labels.subtotal, amount: order.subtotal_amount_float },
    { label: labels.discount, amount: order.discount_amount_float },
    { label: labels.shipping, amount: order.shipping_amount_float },
    { label: labels.taxes, amount: order.total_tax_amount_float },
    { label: labels.giftCard, amount: order.gift_card_amount_float },
  ]

  return {
    label: labels.total,
    amount: amountToDecimal(order.total_amount_with_taxes_float),
    currencyCode: order.currency_code ?? "",
    countryCode: expressCountryCode(order) ?? "",
    lineItems: lineItems
      .filter(({ amount }) => (amount ?? 0) !== 0)
      .map(({ label, amount }) => ({ label, amount: amountToDecimal(amount) })),
  }
}
