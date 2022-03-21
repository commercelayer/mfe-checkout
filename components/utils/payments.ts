export function getTranslations(value: string, t: (a: string) => string) {
  switch (value) {
    case "Stripe Payment":
    case "Adyen Payment":
    case "Braintree Payment":
    case "Checkout Com Payment":
      return t("stepPayment.creditCard")

    case "Paypal Payment":
      return "PayPal"

    case "Wire transfer":
    case "Wire Transfer":
      return t("stepPayment.wireTransfer")

    default:
      return value || ""
  }
}
