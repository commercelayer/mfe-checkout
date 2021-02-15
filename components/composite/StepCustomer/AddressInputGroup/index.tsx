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
import { useContext, useEffect, useState } from "react"
import styled from "styled-components"

import { AppContext } from "components/data/AppProvider"
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
  isShipping?: boolean
}

export const AddressInputGroup: React.FC<Props> = ({
  fieldName,
  resource,
  type,
  value,
  isShipping = false,
}) => {
  const { t } = useTranslation()

  const appCtx = useContext(AppContext)

  let shippingCountryCodeLock = ""

  if (appCtx) {
    shippingCountryCodeLock = appCtx.shippingCountryCodeLock
  }

  const label = t(`addressForm.${fieldName}`)

  const [valueStatus, setValueStatus] = useState(value)

  const isCountry =
    fieldName === "shipping_address_country_code" ||
    fieldName === "billing_address_country_code"

  useEffect(() => {
    if (!!shippingCountryCodeLock && !!isCountry && isShipping) {
      setValueStatus(shippingCountryCodeLock)
    } else {
      setValueStatus(value || "")
    }
  }, [value, shippingCountryCodeLock])

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
              /* placeholder={{
                label: valueStatus || "",
                value: valueStatus || "",
                disabled: true,
              }} */
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
