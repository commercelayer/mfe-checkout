type NullableType<T> = T | null | undefined
type ChildrenType = JSX.Element[] | JSX.Element | null

interface HSLProps {
  h: number
  s: string
  l: string
}

interface LinkConfig {
  cart?: string
  checkout?: string
  my_account?: string
  identity?: string
}

interface Country {
  value: string
  label: string
}

interface StateConfig {
  [countryCode: string]: Country[]
}

interface CheckoutConfig {
  thankyou_page?: string
  billing_countries?: Country[]
  shipping_countries?: Country[]
  billing_states?: StateConfig[]
  shipping_states?: StateConfig[]
  default_country?: string
}

interface UrlsConfig {
  privacy: string
  terms: string
}

interface DefaultConfig {
  links?: LinkConfig
  checkout?: CheckoutConfig
  urls?: UrlsConfig
}

interface Configs {
  default: DefaultConfig
  [key: string]: Partial<DefaultConfig>
}

interface CheckoutSettings {
  accessToken: string
  orderId: string
  orderNumber: string
  validCheckout: true
  isGuest: boolean
  isShipmentRequired: boolean
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
  config: NullableType<DefaultConfig>
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
  | "isGuest"
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
