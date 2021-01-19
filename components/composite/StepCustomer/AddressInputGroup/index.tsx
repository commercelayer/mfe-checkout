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
import { ResourceErrorType } from "@commercelayer/react-components/dist/typings/errors"

import { useTranslation } from "components/data/i18n"
import "twin.macro"

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
    <div tw="mb-4">
      <label htmlFor={fieldName} tw="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        {isCountry ? (
          <AddressCountrySelector
            data-cy={`input_${fieldName}`}
            name={fieldName as AddressCountrySelectName}
            value={value}
            placeholder={{
              value: "",
              label,
              disabled: true,
            }}
          />
        ) : (
          <AddressInput
            data-cy={`input_${fieldName}`}
            name={fieldName as AddressInputName}
            type={type}
            tw="block w-full border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            placeholder={label}
            value={value}
          />
        )}
      </div>
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
