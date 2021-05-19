interface HSLProps {
  h: number
  s: number
  l: number
}

interface CheckoutSettings {
  accessToken: string
  orderId: string
  orderNumber: number
  validCheckout: boolean
  endpoint: string
  logoUrl: string
  companyName: string
  language: string
  primaryColor: HSLProps
  contrastColor: HSLProps
  favicon: string
  gtmId: string
  supportEmail: string
  supportPhone: string
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
  | "contrastColor"
  | "favicon"
  | "gtmId"
  | "supportEmail"
  | "supportPhone"
>
