interface CheckoutSettings {
  accessToken: string
  orderId: string
  validCheckout: boolean
  endpoint: string
  logoUrl: string
  companyName: string
  language: string
  primaryColor: string
  contrastColor: string
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
