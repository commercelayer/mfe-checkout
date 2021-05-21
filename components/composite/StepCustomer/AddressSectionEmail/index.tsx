import {
  CustomerContainer,
  CustomerInput,
  Errors,
} from "@commercelayer/react-components"
import { ErrorComponentProps } from "@commercelayer/react-components/dist/typings/errors"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import tw from "twin.macro"

import { ErrorCss } from "components/ui/form/Error"
import { InputCss } from "components/ui/form/Input"
import { Label } from "components/ui/form/Label"

interface Props {
  readonly?: boolean
  emailAddress: string
}

export const AddressSectionEmail: React.FC<Props> = ({
  readonly,
  emailAddress,
}) => {
  const { t } = useTranslation()

  const messages: ErrorComponentProps["messages"] = [
    {
      code: "EMPTY_ERROR",
      resource: "billingAddress",
      field: "firstName",
      message: t("input.cantBlank"),
    },
    {
      code: "VALIDATION_ERROR",
      resource: "billingAddress",
      field: "email",
      message: t("input.mustBeValidEmail"),
    },
  ]

  return (
    <Wrapper>
      <div className="relative">
        {readonly ? (
          <ReadOnlyEmail data-cy="current-customer-email">
            {emailAddress}
          </ReadOnlyEmail>
        ) : (
          <CustomerContainer isGuest>
            <StyledCustomInput
              className="form-input"
              data-cy="customer_email"
              id="customer_email"
              errorClassName="hasError"
              // tw="block w-full border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              placeholder="E-mail"
              saveOnBlur={true}
              value={emailAddress}
            />
            <StyledErrors
              data-cy="customer_email_error"
              resource="order"
              field="customer_email"
              messages={messages}
            />
          </CustomerContainer>
        )}
        <Label htmlFor="customer_email">
          {t("addressForm.customer_email")}
        </Label>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`mt-6 mb-2`}
`
const ReadOnlyEmail = styled.div`
  ${InputCss}
  ${tw`w-full inline-block bg-gray-50`}
`

const StyledCustomInput = styled(CustomerInput)`
  ${InputCss}
  &.hasError {
    ${tw`border-red-400 border-2 focus:ring-offset-0 focus:ring-red-400 focus:ring-opacity-50`}
  }
`
const StyledErrors = styled(Errors)`
  ${ErrorCss}
`
