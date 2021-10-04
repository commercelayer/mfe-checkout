import {
  Errors,
  AddressInput,
  AddressCountrySelector,
  AddressStateSelector,
} from "@commercelayer/react-components"
import {
  AddressCountrySelectName,
  AddressInputName,
  AddressStateSelectName,
  BaseInputType,
} from "@commercelayer/react-components/dist/typings"
import {
  ResourceErrorType,
  ErrorComponentProps,
} from "@commercelayer/react-components/dist/typings/errors"
import { useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import tw from "twin.macro"

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
      code: "VALIDATION_ERROR",
      resource: "billingAddress",
      field: fieldName,
      message: t("input.mustBeValidFormat"),
    },
    {
      code: "VALIDATION_ERROR",
      resource: "shippingAddress",
      field: fieldName,
      message: t("input.mustBeValidFormat"),
    },
    {
      code: "EMPTY_ERROR",
      resource: "billingAddress",
      field: fieldName,
      message: t("input.cantBlank"),
    },
    {
      code: "EMPTY_ERROR",
      resource: "shippingAddress",
      field: fieldName,
      message: t("input.cantBlank"),
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

  const isState =
    fieldName === "shipping_address_state_code" ||
    fieldName === "billing_address_state_code"

  useEffect(() => {
    setValueStatus(value || "")
  }, [value])

  function renderInput() {
    if (isCountry) {
      return (
        <>
          <StyledAddressCountrySelector
            id={fieldName}
            className="form-select"
            data-cy={`input_${fieldName}`}
            name={fieldName as AddressCountrySelectName}
            placeholder={{
              label: t(`addressForm.${fieldName}_placeholder`),
              value: "",
            }}
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
          <Label htmlFor={fieldName}>{label}</Label>
        </>
      )
    } else if (isState) {
      return (
        <>
          <StyledAddressStateSelector
            id={fieldName}
            className="form-select"
            inputClassName="form-input AddressInputGroup__StyledAddressStateSelector-sc-8zexlr-3 YFJoH"
            data-cy={`input_${fieldName}`}
            name={fieldName as AddressStateSelectName}
            value={value}
          />
          <Label htmlFor={fieldName}>{label}</Label>
        </>
      )
    } else {
      return (
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
      )
    }
  }

  return (
    <div className="mb-8">
      <Wrapper>
        <div className="relative h-10">{renderInput()}</div>
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
  &.hasError {
    ${tw`border-red-400 border-2 focus:ring-offset-0 focus:ring-red-400 focus:ring-opacity-50`}
  }
`

const StyledAddressCountrySelector = styled(AddressCountrySelector)`
  ${InputCss}
`

const StyledAddressStateSelector = styled(AddressStateSelector)`
  ${InputCss}
`

const StyledErrors = styled(Errors)`
  ${ErrorCss}
`
