import { AddressCollection } from "@commercelayer/js-sdk"
import { Fragment } from "react"
import styled from "styled-components"
import tw from "twin.macro"

import { AddressInputGroup } from "components/composite/StepCustomer/AddressInputGroup"

interface Props {
  shippingAddress: AddressCollection | null
  isGuest: boolean
  isUsingNewShippingAddress: boolean
}

export const ShippingAddressFormNew: React.FC<Props> = ({
  shippingAddress,
  isUsingNewShippingAddress,
}: Props) => {
  return (
    <Fragment>
      <Grid>
        <AddressInputGroup
          fieldName="shipping_address_first_name"
          resource="shippingAddress"
          type="text"
          value={isUsingNewShippingAddress ? shippingAddress?.firstName : ""}
        />

        <AddressInputGroup
          fieldName="shipping_address_last_name"
          resource="shippingAddress"
          type="text"
          value={isUsingNewShippingAddress ? shippingAddress?.lastName : ""}
        />
      </Grid>

      <AddressInputGroup
        fieldName="shipping_address_line_1"
        resource="shippingAddress"
        type="text"
        value={isUsingNewShippingAddress ? shippingAddress?.line1 : ""}
      />

      <Grid>
        <AddressInputGroup
          fieldName="shipping_address_city"
          resource="shippingAddress"
          type="text"
          value={isUsingNewShippingAddress ? shippingAddress?.city : ""}
        />

        <AddressInputGroup
          fieldName="shipping_address_country_code"
          resource="shippingAddress"
          type="text"
          value={isUsingNewShippingAddress ? shippingAddress?.countryCode : ""}
        />
      </Grid>

      <Grid>
        <AddressInputGroup
          fieldName="shipping_address_state_code"
          resource="shippingAddress"
          type="text"
          value={isUsingNewShippingAddress ? shippingAddress?.stateCode : ""}
        />

        <AddressInputGroup
          fieldName="shipping_address_zip_code"
          resource="shippingAddress"
          type="text"
          value={isUsingNewShippingAddress ? shippingAddress?.zipCode : ""}
        />
      </Grid>

      <AddressInputGroup
        fieldName="shipping_address_phone"
        resource="shippingAddress"
        type="tel"
        value={isUsingNewShippingAddress ? shippingAddress?.phone : ""}
      />
    </Fragment>
  )
}

const Grid = styled.div`
  ${tw`grid grid-cols-2 gap-4`}
`
