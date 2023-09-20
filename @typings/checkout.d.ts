type NullableType<T> = T | null | undefined
type ChildrenType = JSX.Element[] | JSX.Element | null

interface HSLProps {
  h: number
  s: string
  l: string
}

interface CheckoutSettings {
  accessToken: string
  orderId: string
  orderNumber: number
  validCheckout: true
  endpoint: string
  domain: string
  slug: string
  logoUrl: NullableType<string>
  companyName: string
  language: string
  primaryColor: string
  favicon: string
  gtmId: NullableType<string>
  supportEmail: NullableType<string>
  supportPhone: NullableType<string>
  termsUrl: NullableType<string>
  privacyUrl: NullableType<string>
}

interface InvalidCheckoutSettings {
  validCheckout: false
  retryOnError: boolean
}

type CheckoutPageContextProps = Pick<
  CheckoutSettings,
  | "accessToken"
  | "orderId"
  | "logoUrl"
  | "companyName"
  | "endpoint"
  | "language"
  | "primaryColor"
  | "favicon"
  | "gtmId"
  | "supportEmail"
  | "supportPhone"
  | "termsUrl"
  | "privacyUrl"
>
