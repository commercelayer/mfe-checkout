import { AddressCollection } from "@commercelayer/js-sdk"
import {
  AddressesContainer,
  BillingAddressForm,
  SaveAddressesButton,
  ShippingAddressForm,
  CustomerContainer,
  BillingAddressContainer,
  ShippingAddressContainer,
} from "@commercelayer/react-components"
import { useState, Fragment, useEffect } from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

import "twin.macro"
import { AddButton } from "components/ui/AddButton"
import { ButtonCss } from "components/ui/Button"
import { CustomerAddressCard } from "components/ui/CustomerAddressCard"
import { GridContainer } from "components/ui/GridContainer"
import { Toggle } from "components/ui/Toggle"

import { AddressButtonAddNew } from "./AddressButtonAddNew"
import { AddressSectionEmail } from "./AddressSectionEmail"
import { AddressSectionSaveForm } from "./AddressSectionSaveForm"
import { AddressSectionSaveOnAddressBook } from "./AddressSectionSaveOnAddressBook"
import { AddressSectionTitle } from "./AddressSectionTitle"
import { BillingAddressFormNew } from "./BillingAddressFormNew"
import { ShippingAddressFormNew } from "./ShippingAddressFormNew"

interface Props {
  billingAddress: AddressCollection | null
  shippingAddress: AddressCollection | null
  hasSameAddresses: boolean
  isShipmentRequired: boolean
  isUsingNewBillingAddress: boolean
  isUsingNewShippingAddress: boolean
  hasCustomerAddresses: boolean
  isGuest: boolean
  emailAddress: string
  isLocalLoader: boolean
  handleSave: () => void
}

export const CheckoutCustomerAddresses: React.FC<Props> = ({
  billingAddress,
  shippingAddress,
  isUsingNewBillingAddress,
  isUsingNewShippingAddress,
  isShipmentRequired,
  hasSameAddresses,
  hasCustomerAddresses,
  isGuest,
  emailAddress,
  isLocalLoader,
  handleSave,
}: Props) => {
  const { t } = useTranslation()

  const [
    billingAddressFill,
    setBillingAddressFill,
  ] = useState<AddressCollection | null>(billingAddress)
  const [
    shippingAddressFill,
    setShippingAddressFill,
  ] = useState<AddressCollection | null>(shippingAddress)

  const [shipToDifferentAddress, setShipToDifferentAddress] = useState<boolean>(
    !hasSameAddresses
  )

  const [showBillingAddressForm, setShowBillingAddressForm] = useState<boolean>(
    isUsingNewBillingAddress
  )
  const [
    showShippingAddressForm,
    setShowShippingAddressForm,
  ] = useState<boolean>(isUsingNewShippingAddress)

  useEffect(() => {
    if (shipToDifferentAddress && !hasCustomerAddresses) {
      1
      setShippingAddressFill(null)
      setShowShippingAddressForm(true)
    }
  }, [shipToDifferentAddress])

  const handleShowBillingForm = () => {
    setBillingAddressFill(null)
    setShowBillingAddressForm(!showBillingAddressForm)
  }

  const handleShowShippingForm = () => {
    setShippingAddressFill(null)
    setShowShippingAddressForm(!showShippingAddressForm)
  }

  const handleToggle = () => {
    if (!hasCustomerAddresses) {
      handleShowShippingForm()
    }
    if (hasCustomerAddresses) {
      setShowShippingAddressForm(false)
    }
    setShipToDifferentAddress(!shipToDifferentAddress)
  }

  return (
    <Fragment>
      <AddressSectionEmail isGuest={isGuest} emailAddress={emailAddress} />
      <CustomerContainer>
        <AddressesContainer shipToDifferentAddress={shipToDifferentAddress}>
          <div className="mt-4">
            <AddressSectionTitle>
              {t(`addressForm.billing_address_title`)}
            </AddressSectionTitle>
            <GridContainer>
              <BillingAddressContainer>
                <CustomerAddressCard
                  addressType="billing"
                  deselect={showBillingAddressForm}
                  onSelect={() =>
                    showBillingAddressForm && setShowBillingAddressForm(false)
                  }
                />
              </BillingAddressContainer>
              <>
                {!showBillingAddressForm && hasCustomerAddresses && (
                  <AddButton
                    dataCy="add_new_billing_address"
                    action={handleShowBillingForm}
                  />
                )}
              </>
            </GridContainer>
          </div>
          <div
            className={
              showBillingAddressForm || !hasCustomerAddresses ? "" : "hidden"
            }
          >
            <BillingAddressForm
              autoComplete="on"
              reset={!showBillingAddressForm}
              errorClassName="border-red"
            >
              {showBillingAddressForm ? (
                <>
                  <BillingAddressFormNew billingAddress={billingAddressFill} />
                  <AddressSectionSaveOnAddressBook addressType="billing" />
                </>
              ) : (
                <Fragment />
              )}
            </BillingAddressForm>
          </div>
          {isShipmentRequired && (
            <>
              <Toggle
                data-cy="button-ship-to-different-address"
                data-status={shipToDifferentAddress}
                label={t(`addressForm.ship_to_different_address`)}
                checked={shipToDifferentAddress}
                onChange={handleToggle}
              />

              <div
                className={`${
                  shipToDifferentAddress && hasCustomerAddresses ? "" : "hidden"
                }`}
              >
                <ShippingAddressContainer>
                  <AddressSectionTitle>
                    {t(`addressForm.shipping_address_title`)}
                  </AddressSectionTitle>
                  <GridContainer className="mb-6">
                    <CustomerAddressCard
                      addressType="shipping"
                      deselect={showShippingAddressForm}
                      onSelect={() =>
                        showShippingAddressForm &&
                        setShowShippingAddressForm(false)
                      }
                    />

                    {!showShippingAddressForm && (
                      <AddButton
                        dataCy="add_new_shipping_address"
                        action={handleShowShippingForm}
                      />
                    )}
                  </GridContainer>
                </ShippingAddressContainer>
              </div>

              <div className={showShippingAddressForm ? "" : "hidden"}>
                <ShippingAddressForm
                  autoComplete="on"
                  hidden={!shipToDifferentAddress}
                  className="p-2"
                  reset={!showShippingAddressForm}
                >
                  {showShippingAddressForm ? (
                    <>
                      <ShippingAddressFormNew
                        shippingAddress={shippingAddressFill}
                      />
                      <AddressSectionSaveOnAddressBook addressType="shipping" />
                    </>
                  ) : (
                    <Fragment />
                  )}
                </ShippingAddressForm>
              </div>
            </>
          )}
          <div tw="flex justify-between items-center">
            <div>
              {(showBillingAddressForm && !isUsingNewBillingAddress) ||
              (showShippingAddressForm && !isUsingNewShippingAddress) ? (
                <AddressButtonAddNew
                  onClick={() => {
                    setShowBillingAddressForm(isUsingNewBillingAddress)
                    setShowShippingAddressForm(isUsingNewShippingAddress)
                  }}
                >
                  Discard changes
                </AddressButtonAddNew>
              ) : null}
            </div>
            <AddressSectionSaveForm>
              <StyledSaveAddressesButton
                disabled={isLocalLoader}
                label={`${isLocalLoader ? "... " : ""}${
                  isShipmentRequired
                    ? t("stepCustomer.continueToDelivery")
                    : t("stepShipping.continueToPayment")
                }`}
                data-cy="save-addresses-button"
                onClick={handleSave}
              />
            </AddressSectionSaveForm>
          </div>
        </AddressesContainer>
      </CustomerContainer>
    </Fragment>
  )
}

const StyledSaveAddressesButton = styled(SaveAddressesButton)`
  ${ButtonCss}
`
