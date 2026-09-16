/**
 * PROTOTYPE — throwaway code, see README.md
 */

/**
 * Shopper data collected by a wallet (Apple Pay / Google Pay), normalized so
 * that the rest of the express flow doesn't have to know which wallet it came
 * from. Every field is optional because wallets redact most of the contact
 * until the payment is actually authorized.
 */
export interface ExpressContact {
  firstName?: NullableType<string>
  lastName?: NullableType<string>
  line1?: NullableType<string>
  line2?: NullableType<string>
  city?: NullableType<string>
  zipCode?: NullableType<string>
  stateCode?: NullableType<string>
  countryCode?: NullableType<string>
  phone?: NullableType<string>
  email?: NullableType<string>
  billing_info?: NullableType<string>
}

/** A shipping method, in the shape both wallets expect to render it. */
export interface ExpressShippingMethod {
  /** Name of the shipping method, used to apply it to every shipment. */
  identifier: string
  label: string
  detail: string
  amount: string
}

/** Order totals, in the shape both wallets expect to render them. */
export interface ExpressTotals {
  label: string
  amount: string
  currencyCode: string
  countryCode: string
  lineItems: Array<{ label: string; amount: string }>
}

export type ExpressStatus =
  | "idle"
  | "initializing"
  | "ready"
  | "processing"
  | "placed"
  | "unavailable"

/** One line of the live flow log shown in the prototype panel. */
export interface ExpressEvent {
  at: string
  step: string
  detail?: string
}
