import { PaymentMethodName } from "@commercelayer/react-components"
import { getTranslations } from "components/utils/payments"
import { useTranslation } from "react-i18next"

// We use this one just because we have only stripe as gateway and we rename it
// to Credit Card
export const PaymentMethodNameWithStripe: React.FC = () => {
  const { t } = useTranslation()

  return (
    <PaymentMethodName>
      {({ htmlFor, labelName }) => (
        <label htmlFor={htmlFor}>{getTranslations(labelName, t)}</label>
      )}
    </PaymentMethodName>
  )
}
