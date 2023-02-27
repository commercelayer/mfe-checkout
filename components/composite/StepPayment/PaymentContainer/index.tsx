import { PaymentMethodsContainer } from "@commercelayer/react-components"
import { useTranslation } from "react-i18next"

interface Props {
  children: JSX.Element[] | JSX.Element
}

export const PaymentContainer = ({ children }: Props) => {
  const { t } = useTranslation()

  const checkoutReturnUrl = `${
    window.location.href.split("?")[0]
  }?paymentReturn=true`

  return (
    <PaymentMethodsContainer
      config={{
        checkoutComPayment: {
          success_url: checkoutReturnUrl,
          failure_url: checkoutReturnUrl,
          options: {
            style: {
              base: {
                padding: "10px",
                border: "1px solid #E6E7E7",
                borderRadius: "0.25rem",
                transition: "border 0.5s ease-out",
                fontSize: "16px",
              },
              valid: {
                color: "#1FDA8",
              },
              invalid: {
                color: "#FF656B",
              },
              placeholder: {
                base: {
                  color: "#DBDCDC",
                  fontFamily: "monospace",
                },
                focus: {
                  color: "#101111",
                },
              },
            },
          },
        },
        adyenPayment: {
          styles: {
            card: {
              base: {
                fontSize: "16px",
                padding: "12px",
                fontFamily: "monospace",
              },
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
          cancel_url: checkoutReturnUrl,
          return_url: checkoutReturnUrl,
          infoMessage: {
            text: t("stepPayment.paypalDescription"),
            className: "text-sm text-gray-400",
          },
        },
        externalPayment: {
          payment_source_token: "testToken12334554",
          customComponent: () => {
            return <div>This is an external payment</div>
          },
        },
      }}
    >
      {children}
    </PaymentMethodsContainer>
  )
}
