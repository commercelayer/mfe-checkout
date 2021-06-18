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
            "inline-flex items-start justify-center w-full p-2 text-xs font-extrabold text-black bg-white border-2 border-primary rounded-md ring-4 ring-gray-200 ring-opacity-50 hover:opacity-80 focus:outline-none focus:ring-opacity-100 disabled:opacity-50 lg:w-auto",
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
              "inline-flex items-start justify-center w-full p-2 text-xs font-extrabold text-black bg-white border-2 border-primary rounded-md ring-4 ring-gray-200 ring-opacity-50 hover:opacity-80 focus:outline-none focus:ring-opacity-100 disabled:opacity-50 lg:w-auto",
          },
        },
      }}
    >
      {children}
    </PaymentMethodsContainer>
  )
}
