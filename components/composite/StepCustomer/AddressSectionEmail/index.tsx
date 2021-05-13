import {
  CustomerContainer,
  CustomerInput,
  Errors,
} from "@commercelayer/react-components"
import { ErrorComponentProps } from "@commercelayer/react-components/dist/typings/errors"
import { Fragment } from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import tw from "twin.macro"

import { InputCss } from "components/ui/form/Input"
import { Label } from "components/ui/form/Label"
import { GridContainer } from "components/ui/GridContainer"

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
      message: t("input.mustBeValidEmail"),
    },
  ]

  return (
    <Wrapper>
      <GridContainer>
        <div className="relative">
          {!isGuest ? (
            <ReadOnlyEmail data-cy="current-customer-email">
              {emailAddress}
            </ReadOnlyEmail>
          ) : (
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
          )}
          <Label htmlFor="customer_email">
            {t("addressForm.customer_email")}
          </Label>
        </div>
      </GridContainer>
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
  ${tw`w-full inline-block`}
`
