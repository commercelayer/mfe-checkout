interface CheckoutSettings {
  accessToken: string
  orderId: string
  validCheckout: boolean
  endpoint: string
  logoUrl: string
  companyName: string
}

type CheckoutContextProps = Pick<
  CheckoutSettings,
  "accessToken" | "orderId" | "logoUrl" | "companyName" | "endpoint"
>
