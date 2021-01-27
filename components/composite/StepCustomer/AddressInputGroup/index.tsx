import {
  Errors,
  AddressInput,
  AddressCountrySelector,
} from "@commercelayer/react-components"
import {
  AddressCountrySelectName,
  AddressInputName,
  BaseInputType,
} from "@commercelayer/react-components/dist/typings"
import {
  ResourceErrorType,
  ErrorComponentProps,
} from "@commercelayer/react-components/dist/typings/errors"
import styled, { css } from "styled-components"
import tw from "twin.macro"

import { useTranslation } from "components/data/i18n"

const messages: ErrorComponentProps["messages"] = [
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

interface Props {
  type: BaseInputType
  fieldName: AddressInputName | AddressCountrySelectName | "email"
  resource: ResourceErrorType
  value?: string
}

export const AddressInputGroup: React.FC<Props> = ({
  fieldName,
  resource,
  type,
  value,
}) => {
  const { t } = useTranslation()

  const label = t(`addressForm.${fieldName}`)

  const isCountry =
    fieldName === "shipping_address_country_code" ||
    fieldName === "billing_address_country_code"

  return (
    <div className="mb-4">
      <Wrapper>
        <Label htmlFor={fieldName}>{label}</Label>
        <div className="mt-1">
          {isCountry ? (
            <StyledAddressCountrySelector
              data-cy={`input_${fieldName}`}
              name={fieldName as AddressCountrySelectName}
              value={value}
              placeholder={{
                value: "",
                label: "Please select your country",
                disabled: true,
              }}
            />
          ) : (
            <StyledAddressInput
              id={fieldName}
              data-cy={`input_${fieldName}`}
              name={fieldName as AddressInputName}
              type={type}
              value={value}
            />
          )}
        </div>
      </Wrapper>
      <p tw="mt-2 text-sm text-red-600" id="email-error">
        <Errors
          data-cy={`error_${fieldName}`}
          resource={resource}
          field={fieldName}
          messages={messages}
        />
      </p>
    </div>
  )
}

const Wrapper = styled.div`
  position: relative;
`

const Label = styled.label`
  ${tw`block text-sm font-bold text-gray-700`}
`

const inputBaseCss = css`
  ${tw`block w-full border-gray-300 border focus:ring-blue-400 focus:ring-2 focus:outline-none  sm:text-sm rounded-md py-2 px-2`}
`

const StyledAddressInput = styled(AddressInput)`
  ${inputBaseCss}
`

const StyledAddressCountrySelector = styled(AddressCountrySelector)`
  ${inputBaseCss}
`
