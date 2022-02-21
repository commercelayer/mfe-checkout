import { PaymentMethodsContainer } from "@commercelayer/react-components"
import { useTranslation } from "react-i18next"

export const PaymentContainer: React.FC = ({ children }) => {
  const { t } = useTranslation()

  return (
    <PaymentMethodsContainer
      config={{
        adyenPayment: {
          styles: {
            base: {
              fontSize: "16px",
              padding: "12px",
              fontFamily: "monospace",
            },
          },
        },
        braintreePayment: {
          styles: {
            // Style all elements
            input: {
              "font-size": "16px",
              "font-family": "monospace",
              padding: "10px",
            },
          },
          containerClassName: "flex flex-col",
          fieldsContainerClassName: "flex flex-col xl:flex-row",
          cardDetailsContainerClassName: "flex justify-between",
          cardContainerClassName: "grow mb-3 xl:mb-0",
          expDateContainerClassName: "flex-none w-2/4 xl:mx-3 xl:w-24",
          cvvContainerClassName: "flex-none w-2/4 pl-3 xl:w-14 xl:pl-0",
          inputWrapperClassName: "h-8 border rounded",
          fieldLabelClassName: "text-xs text-gray-400",
        },
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
                fontSize: "16px",
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
        },
        wireTransfer: {
          infoMessage: {
            text: t("stepPayment.wireTransferDescription"),
            className: "text-sm text-gray-400",
          },
        },
        paypalPayment: {
          cancel_url: `${window.location.href}&paymentReturn=true`,
          return_url: `${window.location.href}&paymentReturn=true`,
          infoMessage: {
            text: t("stepPayment.paypalDescription"),
            className: "text-sm text-gray-400",
          },
        },
      }}
    >
      {children}
    </PaymentMethodsContainer>
  )
}
