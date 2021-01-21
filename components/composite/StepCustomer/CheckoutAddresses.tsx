import { AddressCollection } from "@commercelayer/js-sdk"
import {
  Errors,
  AddressesContainer,
  BillingAddressForm,
  AddressInput,
  SaveAddressesButton,
  ShippingAddressForm,
  CustomerContainer,
  CustomerInput,
} from "@commercelayer/react-components"
import { useState, Fragment } from "react"
import styled from "styled-components"
import tw from "twin.macro"

import { useTranslation } from "components/data/i18n"
import { Toggle } from "components/ui/Toggle"

import { AddressInputGroup } from "./AddressInputGroup"
import { AddressSectionEmail } from "./AddressSectionEmail"
import { AddressSectionSaveForm } from "./AddressSectionSaveForm"
import { AddressSectionSaveOnBook } from "./AddressSectionSaveOnBook"
import { AddressSectionTitle } from "./AddressSectionTitle"
import { BillingAddressFormNew } from "./BillingAddressFormNew"

interface Props {
  billingAddress: AddressCollection | null
  shippingAddress: AddressCollection | null
  emailAddress: string
  isGuest: boolean
  refetchOrder: () => void
}

export const CheckoutAddresses: React.FC<Props> = ({
  billingAddress,
  shippingAddress,
  emailAddress,
  isGuest,
  refetchOrder,
}: Props) => {
  const { t } = useTranslation()

  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false)

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
      {isGuest && (
        <CustomerContainer>
          <AddressSectionEmail>
            <CustomerInput
              data-cy="customer_email"
              tw="block w-full border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              placeholder="E-mail"
              saveOnBlur={true}
              onBlur={true}
              value={emailAddress}
            />
            <Errors
              data-cy="customer_email_error"
              resource="order"
              field="customer_email"
              messages={messages}
            />
          </AddressSectionEmail>
        </CustomerContainer>
      )}
      <AddressesContainer shipToDifferentAddress={shipToDifferentAddress}>
        <AddressSectionTitle>
          {t(`addressForm.billing_address_title`)}
        </AddressSectionTitle>
        <BillingAddressForm autoComplete="on" className="p-2">
          <BillingAddressFormNew billingAddress={billingAddress} isGuest />
        </BillingAddressForm>
        <Toggle
          data-cy="button-ship-to-different-address"
          data-status={shipToDifferentAddress}
          label={t(`addressForm.ship_to_different_address`)}
          checked={shipToDifferentAddress}
          onChange={() => setShipToDifferentAddress(!shipToDifferentAddress)}
        />

        <ShippingAddressForm
          autoComplete="on"
          hidden={!shipToDifferentAddress}
          tw={"p-2"}
        >
          <AddressSectionTitle>
            {t(`addressForm.shipping_address_title`)}
          </AddressSectionTitle>

          <Grid>
            <AddressInputGroup
              fieldName="shipping_address_first_name"
              resource="shippingAddress"
              type="text"
              value={shippingAddress?.firstName}
            />

            <AddressInputGroup
              fieldName="shipping_address_last_name"
              resource="shippingAddress"
              type="text"
              value={shippingAddress?.lastName}
            />
          </Grid>

          <AddressInputGroup
            fieldName="shipping_address_line_1"
            resource="shippingAddress"
            type="text"
            value={shippingAddress?.line1}
          />

          <Grid>
            <AddressInputGroup
              fieldName="shipping_address_city"
              resource="shippingAddress"
              type="text"
              value={shippingAddress?.city}
            />

            <AddressInputGroup
              fieldName="shipping_address_country_code"
              resource="shippingAddress"
              type="text"
              value={shippingAddress?.countryCode}
            />
          </Grid>

          <Grid>
            <AddressInputGroup
              fieldName="shipping_address_state_code"
              resource="shippingAddress"
              type="text"
              value={shippingAddress?.stateCode}
            />

            <AddressInputGroup
              fieldName="shipping_address_zip_code"
              resource="shippingAddress"
              type="text"
              value={shippingAddress?.zipCode}
            />
          </Grid>

          <AddressInputGroup
            fieldName="shipping_address_phone"
            resource="shippingAddress"
            type="tel"
            value={shippingAddress?.phone}
          />

          {!isGuest ? (
            <AddressSectionSaveOnBook>
              <AddressInput
                data-cy="billing_address_save_to_customer_book"
                name="billing_address_save_to_customer_book"
                type="checkbox"
                tw="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400 align-middle"
                required={false}
              />
              {" " + t("stepCustomer.saveAddressBook")}
            </AddressSectionSaveOnBook>
          ) : (
            <Fragment />
          )}
        </ShippingAddressForm>
        <AddressSectionSaveForm>
          <SaveAddressesButton
            data-cy="save-addresses-button"
            tw="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent leading-4 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            onClick={refetchOrder}
          />
        </AddressSectionSaveForm>
      </AddressesContainer>
    </Fragment>
  )
}

const Grid = styled.div`
  ${tw`grid grid-cols-2 gap-4`}
`
