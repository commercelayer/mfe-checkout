interface HSLProps {
  h: number
  s: string
  l: string
}

interface CheckoutSettings {
  accessToken: string
  orderId: string
  orderNumber: number
  validCheckout: boolean
  endpoint: string
  logoUrl?: string
  slug: string
  companyName: string
  language: string
  primaryColor: HSLProps
  favicon: string
  gtmId?: string
  supportEmail: string
  supportPhone: string
  termsUrl: string
  privacyUrl: string
}

type CheckoutPageContextProps = Pick<
  CheckoutSettings,
  | "accessToken"
  | "orderId"
  | "logoUrl"
  | "slug"
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
