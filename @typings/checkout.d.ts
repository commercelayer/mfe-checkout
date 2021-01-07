interface CheckoutSettings {
  accessToken: string
  orderId: string
  validCheckout: boolean
  endpoint: string
  logoUrl: string
  companyName: string
  language: string
}

type CheckoutPageContextProps = Pick<
  CheckoutSettings,
  | "accessToken"
  | "orderId"
  | "logoUrl"
  | "companyName"
  | "endpoint"
  | "language"
>