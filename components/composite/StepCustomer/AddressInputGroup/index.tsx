import {
  Errors,
  AddressInput,
  AddressCountrySelector,
  AddressStateSelector,
  ErrorComponentProps,
  ResourceErrorType,
  AddressCountrySelectName,
  AddressInputName,
  AddressStateSelectName,
  BaseInputType,
} from "@commercelayer/react-components"
import { ChangeEvent, useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import tw from "twin.macro"

import {
  ShippingToggleProps,
  evaluateShippingToggle,
} from "components/composite/StepCustomer"
import { AppContext } from "components/data/AppProvider"
import { ErrorCss } from "components/ui/form/Error"
import { InputCss } from "components/ui/form/Input"
import { Label } from "components/ui/form/Label"

interface Props {
  type: BaseInputType
  fieldName: AddressInputName | AddressCountrySelectName | "email"
  resource: ResourceErrorType
  required?: boolean
  value?: string
  openShippingAddress?: (props: ShippingToggleProps) => void
}

export const AddressInputGroup: React.FC<Props> = ({
  fieldName,
  resource,
  required,
  type,
  value,
  openShippingAddress,
}) => {
  const { t } = useTranslation()

  const messages: ErrorComponentProps["messages"] = [
    {
      code: "VALIDATION_ERROR",
      resource: "billing_address",
      field: fieldName,
      message: t("input.mustBeValidFormat"),
    },
    {
      code: "VALIDATION_ERROR",
      resource: "shipping_address",
      field: fieldName,
      message: t("input.mustBeValidFormat"),
    },
    {
      code: "EMPTY_ERROR",
      resource: "billing_address",
      field: fieldName,
      message: t("input.cantBlank"),
    },
    {
      code: "EMPTY_ERROR",
      resource: "shipping_address",
      field: fieldName,
      message: t("input.cantBlank"),
    },
  ]

  const appCtx = useContext(AppContext)

  let shippingCountryCodeLock: string | undefined = ""

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

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (isCountry && fieldName === "billing_address_country_code") {
      const countryCode = event.target.value

      openShippingAddress &&
        openShippingAddress(
          evaluateShippingToggle({ countryCode, shippingCountryCodeLock })
        )
    }
  }

  function renderInput() {
    if (isCountry) {
      return (
        <>
          <StyledAddressCountrySelector
            id={fieldName}
            className="form-select"
            data-test-id={`input_${fieldName}`}
            name={fieldName as AddressCountrySelectName}
            placeholder={{
              label: t(`addressForm.${fieldName}_placeholder`),
              value: "",
            }}
            onChange={handleChange}
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
            selectClassName="form-select"
            inputClassName="form-input"
            data-test-id={`input_${fieldName}`}
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
            required={required}
            data-test-id={`input_${fieldName}`}
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
        data-test-id={`error_${fieldName}`}
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
  &:disabled {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' class='h-2 w-2' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z' clip-rule='evenodd' /%3E%3C/svg%3E");
    background-size: 1rem;
  }
  ${tw`disabled:bg-gray-50`}
`

const StyledAddressStateSelector = styled(AddressStateSelector)`
  ${InputCss}
  &.hasError {
    ${tw`border-red-400 border-2 focus:ring-offset-0 focus:ring-red-400 focus:ring-opacity-50`}
  }
`

const StyledErrors = styled(Errors)`
  ${ErrorCss}
`
