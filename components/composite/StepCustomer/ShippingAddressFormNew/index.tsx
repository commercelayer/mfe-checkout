import { AddressCollection } from "@commercelayer/js-sdk"
import { Fragment } from "react"
import styled from "styled-components"
import tw from "twin.macro"

import { AddressInputGroup } from "components/composite/StepCustomer/AddressInputGroup"

interface Props {
  shippingAddress: AddressCollection | null
}

export const ShippingAddressFormNew: React.FC<Props> = ({
  shippingAddress,
}: Props) => {
  return (
    <Fragment>
      <Grid>
        <AddressInputGroup
          fieldName="shipping_address_first_name"
          resource="shippingAddress"
          type="text"
          value={shippingAddress?.firstName || ""}
        />

        <AddressInputGroup
          fieldName="shipping_address_last_name"
          resource="shippingAddress"
          type="text"
          value={shippingAddress?.lastName || ""}
        />
      </Grid>

      <AddressInputGroup
        fieldName="shipping_address_line_1"
        resource="shippingAddress"
        type="text"
        value={shippingAddress?.line1 || ""}
      />

      <Grid>
        <AddressInputGroup
          fieldName="shipping_address_city"
          resource="shippingAddress"
          type="text"
          value={shippingAddress?.city || ""}
        />

        <AddressInputGroup
          fieldName="shipping_address_country_code"
          resource="shippingAddress"
          type="text"
          value={shippingAddress?.countryCode || ""}
          isShipping
        />
      </Grid>

      <Grid>
        <AddressInputGroup
          fieldName="shipping_address_state_code"
          resource="shippingAddress"
          type="text"
          value={shippingAddress?.stateCode || ""}
        />

        <AddressInputGroup
          fieldName="shipping_address_zip_code"
          resource="shippingAddress"
          type="text"
          value={shippingAddress?.zipCode || ""}
        />
      </Grid>

      <AddressInputGroup
        fieldName="shipping_address_phone"
        resource="shippingAddress"
        type="tel"
        value={shippingAddress?.phone || ""}
      />
    </Fragment>
  )
}

const Grid = styled.div`
  ${tw`grid grid-cols-2 gap-4`}
`
