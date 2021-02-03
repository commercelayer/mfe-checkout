import { AddressCollection } from "@commercelayer/js-sdk"
import {
  AddressesContainer,
  BillingAddressForm,
  SaveAddressesButton,
  ShippingAddressForm,
} from "@commercelayer/react-components"
import { useState, Fragment, useEffect } from "react"
import tw from "twin.macro"

import { useTranslation } from "components/data/i18n"
import { Toggle } from "components/ui/Toggle"

import { AddressSectionEmail } from "./AddressSectionEmail"
import { AddressSectionSaveForm } from "./AddressSectionSaveForm"
import { AddressSectionTitle } from "./AddressSectionTitle"
import { BillingAddressFormNew } from "./BillingAddressFormNew"
import { ShippingAddressFormNew } from "./ShippingAddressFormNew"

interface Props {
  billingAddress: AddressCollection | null
  shippingAddress: AddressCollection | null
  emailAddress: string
  isGuest: boolean
  hasSameAddresses: boolean
  refetchOrder: () => void
}

export const CheckoutAddresses: React.FC<Props> = ({
  billingAddress,
  shippingAddress,
  emailAddress,
  isGuest,
  hasSameAddresses,
  refetchOrder,
}: Props) => {
  const { t } = useTranslation()

  const [
    shippingAddressFill,
    setShippingAddressFill,
  ] = useState<AddressCollection | null>(shippingAddress)

  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(
    !hasSameAddresses
  )

  const handleToggleDifferentAddress = () => [
    setShipToDifferentAddress(!shipToDifferentAddress),
    setShippingAddressFill(null),
  ]

  useEffect(() => {
    if (shipToDifferentAddress) {
      setShippingAddressFill(null)
    }
  }, [shipToDifferentAddress])

  return (
    <Fragment>
      <AddressSectionEmail isGuest={isGuest} emailAddress={emailAddress} />
      <AddressesContainer shipToDifferentAddress={shipToDifferentAddress}>
        <AddressSectionTitle>
          {t(`addressForm.billing_address_title`)}
        </AddressSectionTitle>
        <BillingAddressForm autoComplete="on" className="p-2">
          <BillingAddressFormNew billingAddress={billingAddress} />
        </BillingAddressForm>
        <Toggle
          data-cy="button-ship-to-different-address"
          data-status={shipToDifferentAddress}
          label={t(`addressForm.ship_to_different_address`)}
          checked={shipToDifferentAddress}
          onChange={handleToggleDifferentAddress}
        />

        {shipToDifferentAddress && (
          <ShippingAddressForm
            autoComplete="on"
            hidden={!shipToDifferentAddress}
            tw={"p-2"}
          >
            <AddressSectionTitle>
              {t(`addressForm.shipping_address_title`)}
            </AddressSectionTitle>

            <ShippingAddressFormNew shippingAddress={shippingAddressFill} />
          </ShippingAddressForm>
        )}
        <AddressSectionSaveForm>
          <SaveAddressesButton
            label={t("stepCustomer.continueToDelivery")}
            data-cy="save-addresses-button"
            tw="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent leading-4 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            onClick={refetchOrder}
          />
        </AddressSectionSaveForm>
      </AddressesContainer>
    </Fragment>
  )
}
