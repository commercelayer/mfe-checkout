import { AddressCollection } from "@commercelayer/js-sdk"
import { Fragment } from "react"
import styled from "styled-components"
import tw from "twin.macro"

import { AddressInputGroup } from "components/composite/StepCustomer/AddressInputGroup"

interface Props {
  billingAddress: AddressCollection | null
}

export const BillingAddressFormNew: React.FC<Props> = ({
  billingAddress,
}: Props) => {
  return (
    <Wrapper>
      <Grid>
        <AddressInputGroup
          fieldName="billing_address_first_name"
          resource="billingAddress"
          type="text"
          value={billingAddress?.firstName || ""}
        />
        <AddressInputGroup
          fieldName="billing_address_last_name"
          resource="billingAddress"
          type="text"
          value={billingAddress?.lastName || ""}
        />
      </Grid>
      <AddressInputGroup
        fieldName="billing_address_line_1"
        resource="billingAddress"
        type="text"
        value={billingAddress?.line1 || ""}
      />
      <Grid>
        <AddressInputGroup
          fieldName="billing_address_city"
          resource="billingAddress"
          type="text"
          value={billingAddress?.city || ""}
        />
        <AddressInputGroup
          fieldName="billing_address_country_code"
          resource="billingAddress"
          type="text"
          value={billingAddress?.countryCode || ""}
        />
      </Grid>
      <Grid>
        <AddressInputGroup
          fieldName="billing_address_state_code"
          resource="billingAddress"
          type="text"
          value={billingAddress?.stateCode || ""}
        />
        <AddressInputGroup
          fieldName="billing_address_zip_code"
          resource="billingAddress"
          type="text"
          value={billingAddress?.zipCode || ""}
        />
      </Grid>
      <AddressInputGroup
        fieldName="billing_address_phone"
        resource="billingAddress"
        type="tel"
        value={billingAddress?.phone || ""}
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`mt-8`}
`

const Grid = styled.div`
  ${tw`grid md:grid-cols-2 md:gap-4`}
`
