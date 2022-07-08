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
  logoUrl?: string
  companyName: string
  language: string
  primaryColor: HSLProps
  favicon: string
  gtmId?: string
  supportEmail?: string
  supportPhone?: string
  termsUrl?: string
  privacyUrl?: string
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
