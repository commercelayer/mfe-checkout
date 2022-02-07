import { Address } from "@commercelayer/sdk"
import { useContext } from "react"
import styled from "styled-components"
import tw from "twin.macro"

import { ShippingToggleProps } from "components/composite/StepCustomer"
import { AddressInputGroup } from "components/composite/StepCustomer/AddressInputGroup"
import { AppContext } from "components/data/AppProvider"

interface Props {
  billingAddress: Address | undefined
  openShippingAddress: (props: ShippingToggleProps) => void
}

export const BillingAddressFormNew: React.FC<Props> = ({
  billingAddress,
  openShippingAddress,
}: Props) => {
  const appCtx = useContext(AppContext)

  if (!appCtx) {
    return null
  }

  const { requiresBillingInfo } = appCtx

  return (
    <Wrapper>
      <Grid>
        <AddressInputGroup
          fieldName="billing_address_first_name"
          resource="billing_address"
          type="text"
          value={billingAddress?.first_name || ""}
        />
        <AddressInputGroup
          fieldName="billing_address_last_name"
          resource="billing_address"
          type="text"
          value={billingAddress?.last_name || ""}
        />
      </Grid>
      <AddressInputGroup
        fieldName="billing_address_line_1"
        resource="billing_address"
        type="text"
        value={billingAddress?.line_1 || ""}
      />
      <AddressInputGroup
        fieldName="billing_address_line_2"
        resource="billing_address"
        type="text"
        value={billingAddress?.line_2 || ""}
      />
      <Grid>
        <AddressInputGroup
          fieldName="billing_address_city"
          resource="billing_address"
          type="text"
          value={billingAddress?.city || ""}
        />
        <AddressInputGroup
          fieldName="billing_address_country_code"
          resource="billing_address"
          type="text"
          openShippingAddress={openShippingAddress}
          value={billingAddress?.country_code || ""}
        />
      </Grid>
      <Grid>
        <AddressInputGroup
          fieldName="billing_address_state_code"
          resource="billing_address"
          type="text"
          value={billingAddress?.state_code || ""}
        />
        <AddressInputGroup
          fieldName="billing_address_zip_code"
          resource="billing_address"
          type="text"
          value={billingAddress?.zip_code || ""}
        />
      </Grid>
      <AddressInputGroup
        fieldName="billing_address_phone"
        resource="billing_address"
        type="tel"
        value={billingAddress?.phone || ""}
      />
      {requiresBillingInfo && (
        <AddressInputGroup
          fieldName="billing_address_billing_info"
          resource="billing_address"
          type="text"
          value={billingAddress?.billing_info || ""}
        />
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`mt-0`}
`

const Grid = styled.div`
  ${tw`grid lg:grid-cols-2 lg:gap-4`}
`
