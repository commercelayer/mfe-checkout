import { AddressCollection } from "@commercelayer/js-sdk"
import {
  AddressesContainer,
  BillingAddressForm,
  SaveAddressesButton,
  ShippingAddressForm,
} from "@commercelayer/react-components"
import { useState, Fragment, useEffect } from "react"
import { useTranslation } from "react-i18next"

import "twin.macro"
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
  isShipmentRequired: boolean
  isLocalLoader: boolean
  handleSave: () => void
}

export const CheckoutAddresses: React.FC<Props> = ({
  billingAddress,
  shippingAddress,
  emailAddress,
  isGuest,
  hasSameAddresses,
  isShipmentRequired,
  isLocalLoader,
  handleSave,
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
        {isShipmentRequired && (
          <Toggle
            data-cy="button-ship-to-different-address"
            data-status={shipToDifferentAddress}
            label={t(`addressForm.ship_to_different_address`)}
            checked={shipToDifferentAddress}
            onChange={handleToggleDifferentAddress}
          />
        )}

        {isShipmentRequired && shipToDifferentAddress && (
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
            disabled={isLocalLoader}
            label={`${isLocalLoader ? "... " : ""}${
              isShipmentRequired
                ? t("stepCustomer.continueToDelivery")
                : t("stepShipping.continueToPayment")
            }`}
            data-cy="save-addresses-button"
            tw="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-primary border border-transparent leading-4 rounded-md shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            onClick={handleSave}
          />
        </AddressSectionSaveForm>
      </AddressesContainer>
    </Fragment>
  )
}
