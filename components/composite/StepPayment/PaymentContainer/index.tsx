import { PaymentMethodsContainer } from "@commercelayer/react-components"
import { useTranslation } from "react-i18next"
import "twin.macro"

export const PaymentContainer: React.FC = ({ children }) => {
  const { t } = useTranslation()

  return (
    <PaymentMethodsContainer
      config={{
        braintreePayment: {
          styles: {
            // Style all elements
            input: {
              "font-size": "16px",
              "font-family": "monospace",
              padding: "15px 10px",
            },
          },
          cardFieldsContainerClassName: "flex mb-2",
          containerClassName: "flex",
          fieldContainerClassName: "flex-1",
          inputWrapperClassName: "h-8 border rounded mr-1",
          fieldLabelClassName: "text-xs text-gray-500",
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
            className: "text-sm text-gray-500",
          },
        },
        paypalPayment: {
          cancelUrl: window.location.href,
          returnUrl: window.location.href,
          infoMessage: {
            text: t("stepPayment.paypalDescription"),
            className: "text-sm text-gray-500",
          },
        },
      }}
    >
      {children}
    </PaymentMethodsContainer>
  )
}
