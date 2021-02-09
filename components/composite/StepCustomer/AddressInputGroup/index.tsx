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
import { useEffect, useState } from "react"
import styled from "styled-components"

import { useTranslation } from "components/data/i18n"
import { InputCss } from "components/ui/form/Input"
import { Label } from "components/ui/form/Label"

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

  const [valueStatus, setValueStatus] = useState<string>(value)

  const isCountry =
    fieldName === "shipping_address_country_code" ||
    fieldName === "billing_address_country_code"

  useEffect(() => {
    setValueStatus(value)
  }, [value])

  return (
    <div className="mb-4">
      <Wrapper>
        <Label htmlFor={fieldName}>{label}</Label>
        <div className="mt-1">
          {isCountry ? (
            <StyledAddressCountrySelector
              data-cy={`input_${fieldName}`}
              name={fieldName as AddressCountrySelectName}
              value={valueStatus}
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
              value={valueStatus}
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

const StyledAddressInput = styled(AddressInput)`
  ${InputCss}
`

const StyledAddressCountrySelector = styled(AddressCountrySelector)`
  ${InputCss}
`
