import {
  CustomerContainer,
  CustomerInput,
  Errors,
} from "@commercelayer/react-components"
import { ErrorComponentProps } from "@commercelayer/react-components/dist/typings/errors"
import { useTranslation } from "react-i18next"
import { Fragment } from "react"
import styled from "styled-components"
import tw from "twin.macro"

import { InputCss } from "components/ui/form/Input"
import { Label } from "components/ui/form/Label"

interface Props {
  isGuest: boolean
  emailAddress: string
}

export const AddressSectionEmail: React.FC<Props> = ({
  isGuest,
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
      message: t("input.mustBeValid"),
    },
  ]

  return (
    <Wrapper>
      <Label htmlFor="customer_email">{t("addressForm.customer_email")}</Label>
      {!isGuest ? (
        <ReadOnlyEmail data-cy="current-customer-email">
          {emailAddress}
        </ReadOnlyEmail>
      ) : (
        <Fragment>
          <CustomerContainer isGuest>
            <StyledCustomInput
              data-cy="customer_email"
              id="customer_email"
              // tw="block w-full border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              placeholder="E-mail"
              saveOnBlur={true}
              value={emailAddress}
            />
            <Errors
              data-cy="customer_email_error"
              resource="order"
              field="customer_email"
              messages={messages}
            />
          </CustomerContainer>
        </Fragment>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.h4`
  ${tw`mb-4`}
`
const ReadOnlyEmail = styled.div`
  ${InputCss}
  ${tw`w-auto inline-block mb-8 bg-gray-100`}
`

const StyledCustomInput = styled(CustomerInput)`
  ${InputCss}
  ${tw`w-1/2 inline-block mb-8`}
`
