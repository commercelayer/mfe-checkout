import {
  AddressesContainer,
  BillingAddress,
  ShippingAddress,
  SaveAddressesButton,
} from "@commercelayer/react-components"
import { useState } from "react"
import styled from "styled-components"
import tw from "twin.macro"

import { useTranslation } from "components/data/i18n"
import { Card } from "components/ui/Card"
import { CardAddress } from "components/ui/CardAddress"
import { Toggle } from "components/ui/Toggle"

import { AddressInputGroup } from "./AddressInputGroup"
import { AddressSectionTitle } from "./AddressSectionTitle"

interface Props {
  isGuest: boolean
}

export const FormAddresses: React.FC<Props> = ({ isGuest }: Props) => {
  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false)
  const { t } = useTranslation()

  return (
    <AddressesContainer shipToDifferentAddress={shipToDifferentAddress}>
      {isGuest && (
        <AddressInputGroup
          fieldName="email"
          resource="billingAddress"
          type="email"
        />
      )}
      <AddressSectionTitle>
        {t(`addressForm.billing_address_title`)}
      </AddressSectionTitle>
      <GridCardAddress>
        <CardAddress
          address={"Via duccio di ducci"}
          user={"Duccio Giovanelli"}
        />
      </GridCardAddress>

      <Toggle
        data-cy="button-ship-to-different-address"
        data-status={shipToDifferentAddress}
        label={t(`addressForm.ship_to_different_address`)}
        checked={shipToDifferentAddress}
        onChange={() => setShipToDifferentAddress(!shipToDifferentAddress)}
      />

      <ShippingAddress
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
          />

          <AddressInputGroup
            fieldName="shipping_address_last_name"
            resource="shippingAddress"
            type="text"
          />
        </Grid>

        <AddressInputGroup
          fieldName="shipping_address_line_1"
          resource="shippingAddress"
          type="text"
        />

        <Grid>
          <AddressInputGroup
            fieldName="shipping_address_city"
            resource="shippingAddress"
            type="text"
          />

          <AddressInputGroup
            fieldName="shipping_address_country_code"
            resource="shippingAddress"
            type="text"
          />
        </Grid>

        <Grid>
          <AddressInputGroup
            fieldName="shipping_address_state_code"
            resource="shippingAddress"
            type="text"
          />

          <AddressInputGroup
            fieldName="shipping_address_zip_code"
            resource="shippingAddress"
            type="text"
          />
        </Grid>

        <AddressInputGroup
          fieldName="shipping_address_phone"
          resource="shippingAddress"
          type="tel"
        />
      </ShippingAddress>
      <div className="p-2 mt-5">
        <SaveAddressesButton
          data-cy="save-addresses-button"
          tw="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent leading-4 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          onClick={() => {
            // TODO: handle callback
            // https://github.com/commercelayer/commercelayer-react-components/blob/master/pages/checkout-addresses.tsx
          }}
        />
      </div>
    </AddressesContainer>
  )
}

const Grid = styled.div`
  ${tw`grid grid-cols-2 gap-4`}
`
const GridCardAddress = styled.div`
  ${tw`grid grid-cols-3 gap-4`}
`
