import {
  CustomerContainer,
  CustomerInput,
  Errors,
} from "@commercelayer/react-components"
import { Fragment } from "react"
import styled from "styled-components"
import tw from "twin.macro"

interface Props {
  isGuest: boolean
  emailAddress: string
}

export const AddressSectionEmail: React.FC<Props> = ({
  isGuest,
  emailAddress,
}) => {
  if (!isGuest) {
    return <Email data-cy="current-customer-email">{emailAddress}</Email>
  }

  const messages: any = [
    {
      code: "EMPTY_ERROR",
      resource: "billingAddress",
      field: "firstName",
      message: `Can't be blank`,
    },
    {
      code: "VALIDATION_ERROR",
      resource: "billingAddress",
      field: "email",
      message: `Must be valid email`,
    },
  ]

  return (
    <Fragment>
      <CustomerContainer>
        <Wrapper>
          <CustomerInput
            data-cy="customer_email"
            tw="block w-full border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
        </Wrapper>
      </CustomerContainer>
    </Fragment>
  )
}

const Wrapper = styled.h4`
  ${tw`mb-4`}
`
const Email = styled.p`
  ${tw`mb-4`}
`
