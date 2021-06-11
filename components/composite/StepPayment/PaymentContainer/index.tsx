import { PaymentMethodsContainer } from "@commercelayer/react-components"
import { useTranslation } from "react-i18next"
import "twin.macro"

interface Props {
  handleSave: () => void
}

export const PaymentContainer: React.FC<Props> = ({ handleSave, children }) => {
  const { t } = useTranslation()

  return (
    <PaymentMethodsContainer
      config={{
        stripePayment: {
          fonts: [
            {
              cssSrc:
                "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap",
            },
          ],
          options: {
            style: {
              base: {
                color: "#000",
                fontWeight: "400",
                fontSize: "18px",
                fontFamily: "Manrope, sans-serif",
                ":-webkit-autofill": {
                  color: "#fce883",
                },
                "::placeholder": {
                  color: "#e0e0e0",
                },
              },
              invalid: {
                iconColor: "#FFC7EE",
                color: "#FFC7EE",
              },
            },
            hideIcon: false,
            hidePostalCode: true,
          },
          handleSubmit: handleSave,
          submitLabel: t("stepPayment.setPaymentMethod"),
          submitClassName:
            "inline-flex items-center justify-center w-full p-3 text-xs font-extrabold text-contrast bg-primary border border-transparent rounded-md hover:opacity-80 disabled:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 lg:w-48",
          containerClassName: "stripe-custom-form",
          submitContainerClassName: "flex justify-end pt-3",
        },
        wireTransfer: {
          infoMessage: {
            text: t("stepPayment.wireTransferDescription"),
            className: "text-sm text-gray-500",
          },
          submitButton: {
            containerClassName: "flex justify-end pt-3",
            onClick: handleSave,
            label: t("stepPayment.setPaymentMethod"),
            className:
              "inline-flex items-start justify-center w-full p-3 text-xs font-extrabold text-contrast bg-primary border border-transparent rounded-md hover:opacity-80 disabled:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 lg:w-48",
          },
        },
      }}
    >
      {children}
    </PaymentMethodsContainer>
  )
}
