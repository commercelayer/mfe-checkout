import { PaymentMethodsContainer } from "@commercelayer/react-components"
import { useTranslation } from "react-i18next"
import "twin.macro"

interface Props {
  handleSave: () => void
  stripeKey: string
}

export const PaymentContainer: React.FC<Props> = ({
  handleSave,
  stripeKey,
  children,
}) => {
  const { t } = useTranslation()

  return (
    <PaymentMethodsContainer
      config={{
        stripePayment: {
          options: {
            classes: { base: "bg-primary", focus: "" },
            hideIcon: false,
          },
          publishableKey: stripeKey,
          handleSubmit: handleSave,
          submitLabel: t("stepPayment.setPaymentMethod"),
          submitClassName:
            "mt-5 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
          containerClassName: "pt-1",
        },
      }}
    >
      {children}
    </PaymentMethodsContainer>
  )
}
