import { PaymentMethodRadioButton } from "@commercelayer/react-components"
import styled from "styled-components"
import tw from "twin.macro"

import { CheckCss } from "components/ui/form/CheckBox"
import { RadioCss } from "components/ui/form/RadioButton"

export const PaymentWrapper = styled.div`
  ${tw`text-black border border-gray-300 mb-5 p-3 rounded bg-gray-50 relative transition duration-200 ease-in hover:border-primary`}

  .payment:last-of-type & {
    ${tw`mb-0`}
  }

  .payment.active & {
    ${tw`border-2 border-primary bg-white cursor-default shadow-md`}

    input[type="radio"] + label {
      ${tw`pointer-events-none cursor-default`}
    }
  }

  :not(.payment.active &)::after {
    ${tw`absolute inset-0 z-0 pointer-events-auto cursor-pointer bg-transparent`}

    content: "";
  }
`
export const PaymentSummary = styled.div`
  ${tw`flex flex-row justify-around text-sm items-center`}
`
export const PaymentSummaryItem = styled.div`
  ${tw`flex flex-1 font-bold leading-none`}
`
export const PaymentRadioContainer = styled.div`
  ${tw`hidden`}
`
export const PaymentSummaryValue = styled.p`
  ${tw`flex font-bold uppercase text-ss leading-8`}
`
export const PaymentSourceContainer = styled.div`
  ${tw`mt-2`}
  .StripeElement, .adyen-checkout__input {
    ${tw`px-2 py-3 border rounded shadow-sm bg-gradient-to-b from-gray-50 transition duration-500 ease-in-out`}
  }

  .adyen-checkout__input {
    ${tw`p-0 border-gray-200`}
  }

  .StripeElement--focus,
  .adyen-checkout__input--focus {
    ${tw`border-gray-300 bg-gradient-to-t`}
  }

  .adyen-checkout__label__text {
    ${tw`transition-none text-gray-500`}
  }
`
export const PaymentDetailsWrapper = styled.div`
  ${tw`flex flex-row items-start justify-between lg:justify-start lg:items-center text-sm`}
`
export const PaymentItemTitle = styled.h5`
  ${tw`text-sm font-bold`}
`
export const ShippingLineItemQty = styled.p`
  ${tw`text-xs text-gray-400 uppercase pt-1`}
`
export const WalletCheckbox = styled.input`
  ${CheckCss}
`
export const StyledPaymentMethodRadioButton = styled(PaymentMethodRadioButton)`
  ${RadioCss}
`
