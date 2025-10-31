import AddressCountrySelector from "@commercelayer/react-components/addresses/AddressCountrySelector"
import AddressInput from "@commercelayer/react-components/addresses/AddressInput"
import AddressStateSelector from "@commercelayer/react-components/addresses/AddressStateSelector"
import { Errors } from "@commercelayer/react-components/errors/Errors"
import type {
  Country,
  States,
} from "@commercelayer/react-components/utils/countryStateCity"
import {
  evaluateShippingToggle,
  type ShippingToggleProps,
} from "components/composite/StepCustomer"
import { AppContext } from "components/data/AppProvider"
import { ErrorCss } from "components/ui/form/Error"
import { InputCss } from "components/ui/form/Input"
import { Label } from "components/ui/form/Label"
import { type ChangeEvent, useContext } from "react"
import { useTranslation } from "react-i18next"

type TFieldName =
  | Parameters<typeof AddressCountrySelector>[0]["name"]
  | Parameters<typeof AddressInput>[0]["name"]
  | Parameters<typeof AddressStateSelector>[0]["name"]

type TInputType = JSX.IntrinsicElements["input"]["type"]
type TResource = Parameters<typeof Errors>[0]["resource"]
type TMessages = Parameters<typeof Errors>[0]["messages"]

interface Props {
  type: TInputType
  fieldName: TFieldName
  resource: TResource
  required?: boolean
  value?: string
  countries?: Country[] | undefined
  defaultCountry?: string
  states?: States[]
  openShippingAddress?: (props: ShippingToggleProps) => void
}

export const AddressInputGroup: React.FC<Props> = ({
  fieldName,
  resource,
  required,
  type,
  countries,
  defaultCountry,
  states,
  value,
  openShippingAddress,
}) => {
  const { t } = useTranslation()

  const messages: TMessages = [
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

  let shippingCountryCodeLock: NullableType<string> = ""

  if (appCtx) {
    shippingCountryCodeLock = appCtx.shippingCountryCodeLock
  }

  const label = t(`addressForm.${fieldName}`)

  const isCountry =
    fieldName === "shipping_address_country_code" ||
    fieldName === "billing_address_country_code"

  const isState =
    fieldName === "shipping_address_state_code" ||
    fieldName === "billing_address_state_code"

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (isCountry && fieldName === "billing_address_country_code") {
      const countryCode = event.target.value

      openShippingAddress?.(
        evaluateShippingToggle({ countryCode, shippingCountryCodeLock }),
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
            data-testid={`input_${fieldName}`}
            name={fieldName}
            placeholder={{
              label: t(`addressForm.${fieldName}_placeholder`),
              value: "",
            }}
            onChange={handleChange}
            countries={countries}
            value={
              shippingCountryCodeLock &&
              fieldName === "shipping_address_country_code"
                ? shippingCountryCodeLock
                : value === "" || value == null
                  ? defaultCountry
                  : value
            }
            disabled={Boolean(
              shippingCountryCodeLock &&
                fieldName === "shipping_address_country_code",
            )}
          />
          <Label htmlFor={fieldName}>{label}</Label>
        </>
      )
    }
    if (isState) {
      return (
        <>
          <StyledAddressStateSelector
            id={fieldName}
            selectClassName="form-select"
            inputClassName="form-input"
            data-testid={`input_${fieldName}`}
            selectPlaceholder={{
              label: t(`addressForm.${fieldName}_placeholder`),
              value: "",
              disabled: true,
            }}
            // @ts-expect-error missing
            states={states}
            name={fieldName}
            value={value}
          />
          <Label htmlFor={fieldName}>{label}</Label>
        </>
      )
    }
    return (
      <>
        <StyledAddressInput
          id={fieldName}
          required={required}
          data-testid={`input_${fieldName}`}
          name={fieldName}
          type={type}
          value={value}
          className="form-input"
        />
        <Label htmlFor={fieldName}>{label}</Label>
      </>
    )
  }

  return (
    <div className="mb-8">
      <Wrapper>
        <div className="relative h-10 mb-2">{renderInput()}</div>
      </Wrapper>

      <StyledErrors
        data-testid={`error_${fieldName}`}
        resource={resource}
        field={fieldName}
        messages={messages}
      />
    </div>
  )
}

const Wrapper: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
  <div
    {...props}
    className={`address-input-wrapper ${props.className || ""}`}
  />
)

const StyledAddressInput: React.FC<
  React.ComponentProps<typeof AddressInput>
> = ({ className = "", ...props }) => (
  <AddressInput
    {...props}
    className={`address-input ${InputCss} ${className} ${className?.includes("hasError") ? "hasError" : ""}`}
  />
)

const StyledAddressCountrySelector: React.FC<
  React.ComponentProps<typeof AddressCountrySelector>
> = ({ className = "", ...props }) => (
  <AddressCountrySelector
    {...props}
    className={`address-country-selector ${InputCss} ${className}`}
  />
)

const StyledAddressStateSelector: React.FC<
  React.ComponentProps<typeof AddressStateSelector>
> = ({ className = "", ...props }) => (
  <AddressStateSelector
    {...props}
    className={`address-input ${InputCss} ${className} ${className?.includes("hasError") ? "hasError" : ""}`}
  />
)

const StyledErrors: React.FC<React.ComponentProps<typeof Errors>> = ({
  className = "",
  ...props
}) => <Errors {...props} className={`${ErrorCss} ${className}`} />
