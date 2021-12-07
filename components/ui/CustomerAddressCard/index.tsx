import { Address, AddressField } from "@commercelayer/react-components"
import { Address as AddressCollection } from "@commercelayer/sdk"

interface AddressCardProps {
  addressType: "shipping" | "billing"
  addresses?: [AddressCollection]
  deselect: boolean
  onSelect?: () => void
}

export const CustomerAddressCard: React.FC<AddressCardProps> = ({
  addressType,
  addresses,
  deselect,
  onSelect,
}) => {
  const dataCy =
    addressType === "billing"
      ? "customer-billing-address"
      : "customer-shipping-address"
  return (
    <Address
      data-cy={dataCy}
      addresses={addresses}
      className={`p-3 rounded border ${
        onSelect && "hover:border-primary cursor-pointer"
      } transition duration-200 ease-in`}
      selectedClassName="!border-2 border-primary shadow-md bg-gray-100"
      deselect={deselect}
      onSelect={onSelect}
      disabledClassName="opacity-50 cursor-not-allowed"
    >
      {
        <AddressField>
          {({ address }) => (
            <CustomAddress
              firstName={address.first_name}
              lastName={address.last_name}
              city={address.city}
              line1={address.line_1}
              line2={address.line_2}
              zipCode={address.zip_code}
              stateCode={address.state_code}
              countryCode={address.country_code}
              phone={address.phone}
              addressType={addressType}
            />
          )}
        </AddressField>
      }
    </Address>
  )
}

interface AddressProps {
  firstName?: string
  lastName?: string
  city?: string
  line1?: string
  line2?: string
  zipCode?: string
  stateCode?: string
  countryCode?: string
  phone?: string
  addressType: string
}

export const CustomAddress = ({
  firstName,
  lastName,
  city,
  line1,
  line2,
  zipCode,
  stateCode,
  countryCode,
  phone,
  addressType,
}: AddressProps) => (
  <>
    <p className="font-bold text-md" data-cy={`fullname_${addressType}`}>
      {firstName} {lastName}
    </p>
    <p
      className="text-sm text-gray-600"
      data-cy={`full_address_${addressType}`}
    >
      {[line1, line2].join(", ")}
      <br />
      {zipCode} {city} - {stateCode} ({countryCode})
      <br />
      {phone}
    </p>
  </>
)
