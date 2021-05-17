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
import styled from "styled-components"

import { ButtonCss } from "components/ui/Button"
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
        <div className="mt-4">
          <AddressSectionTitle>
            {t(`addressForm.billing_address_title`)}
          </AddressSectionTitle>
        </div>
        <BillingAddressForm autoComplete="on" errorClassName="hasError">
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
            className="p-2"
            errorClassName="hasError"
          >
            <div className="pb-4">
              <AddressSectionTitle>
                {t(`addressForm.shipping_address_title`)}
              </AddressSectionTitle>
            </div>
            <ShippingAddressFormNew shippingAddress={shippingAddressFill} />
          </ShippingAddressForm>
        )}
        <div tw="flex justify-between items-center justify-end">
          <AddressSectionSaveForm>
            <StyledSaveAddressesButton
              disabled={isLocalLoader}
              label={`${isLocalLoader ? "... " : ""}${
                isShipmentRequired
                  ? t("stepCustomer.continueToDelivery")
                  : t("stepShipping.continueToPayment")
              }`}
              data-cy="save-addresses-button"
              // tw="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-primary border border-transparent leading-4 rounded-md shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              onClick={handleSave}
            />
          </AddressSectionSaveForm>
        </div>
      </AddressesContainer>
    </Fragment>
  )
}

const StyledSaveAddressesButton = styled(SaveAddressesButton)`
  ${ButtonCss}
`
