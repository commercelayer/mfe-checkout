import { PaymentMethodName } from "@commercelayer/react-components"
import { useTranslation } from "react-i18next"

// We use this one just because we have only stripe as gateway and we rename it
// to Credit Card
export const PaymentMethodNameWithStripe: React.FC = () => {
  const { t } = useTranslation()

  const formatLabel = (value: string) => {
    switch (value) {
      case "Stripe Payment":
        return t("stepPayment.creditCard")

      case "Paypal Payment":
        return "Paypal"

      default:
        return value
    }
  }

  return (
    <PaymentMethodName>
      {({ htmlFor, labelName }) => (
        <label htmlFor={htmlFor}>{formatLabel(labelName)}</label>
      )}
    </PaymentMethodName>
  )
}
