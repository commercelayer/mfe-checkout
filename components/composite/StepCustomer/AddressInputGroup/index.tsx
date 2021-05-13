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
import { useTranslation } from "react-i18next"
import styled from "styled-components"

import { AppContext } from "components/data/AppProvider"
import { ErrorCss } from "components/ui/form/Error"
import { InputCss } from "components/ui/form/Input"
import { Label } from "components/ui/form/Label"

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
    setValueStatus(value || "")
  }, [value])

  return (
    <div className="mb-8">
      <Wrapper>
        <div className="relative h-10">
          {isCountry ? (
            <StyledAddressCountrySelector
              className="form-select"
              data-cy={`input_${fieldName}`}
              name={fieldName as AddressCountrySelectName}
              value={
                shippingCountryCodeLock &&
                fieldName === "shipping_address_country_code"
                  ? shippingCountryCodeLock
                  : value
              }
              disabled={Boolean(
                shippingCountryCodeLock &&
                  fieldName === "shipping_address_country_code"
              )}
            />
          ) : (
            <>
              <StyledAddressInput
                id={fieldName}
                data-cy={`input_${fieldName}`}
                name={fieldName as AddressInputName}
                type={type}
                value={valueStatus}
                className="form-input"
              />
              <Label htmlFor={fieldName}>{label}</Label>
            </>
          )}
        </div>
      </Wrapper>
      <StyledErrors
        data-cy={`error_${fieldName}`}
        resource={resource}
        field={fieldName}
        messages={messages}
      />
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
const StyledErrors = styled(Errors)`
  ${ErrorCss}
`
