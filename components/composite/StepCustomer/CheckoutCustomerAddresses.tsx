import { AddressCollection } from "@commercelayer/js-sdk"
import {
  AddressesContainer,
  BillingAddressForm,
  SaveAddressesButton,
  ShippingAddressForm,
  CustomerContainer,
  BillingAddressContainer,
  Address,
  AddressField,
  ShippingAddressContainer,
} from "@commercelayer/react-components"
import { useState, Fragment, useEffect } from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

import "twin.macro"
import { AddButton } from "components/ui/AddButton"
import { ButtonCss } from "components/ui/Button"
import { FlexContainer } from "components/ui/FlexContainer"
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
          <AddressSectionTitle>
            {t(`addressForm.billing_address_title`)}
          </AddressSectionTitle>
          <FlexContainer>
            <BillingAddressContainer>
              <AddressCardComponent
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
          </FlexContainer>
          <div
            className={
              showBillingAddressForm || !hasCustomerAddresses ? "" : "hidden"
            }
          >
            <BillingAddressForm
              autoComplete="on"
              className="p-2"
              reset={!showBillingAddressForm}
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
                  <FlexContainer>
                    <AddressCardComponent
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
                  </FlexContainer>
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

interface AddressCardProps {
  addressType: "shipping" | "billing"
  deselect: boolean
  onSelect: () => void
}

const AddressCardComponent: React.FC<AddressCardProps> = ({
  addressType,
  deselect,
  onSelect,
}) => {
  const dataCy =
    addressType === "billing"
      ? "customer-billing-address"
      : "customer-shipping-address"
  return (
    <Address
      data-cy={dataCy}
      className="w-1/3 p-3 mr-4 border rounded cursor-pointer hover:border-primary shadow-sm"
      selectedClassName="border-primary"
      deselect={deselect}
      onSelect={onSelect}
      disabledClassName="opacity-50 cursor-not-allowed"
    >
      <div tw="flex font-bold text-md">
        <AddressField name="first_name" />
        <AddressField name="last_name" tw="ml-1" />
      </div>
      <div tw="text-sm text-gray-600">
        <AddressField name="full_address" />
      </div>
    </Address>
  )
}

const StyledSaveAddressesButton = styled(SaveAddressesButton)`
  ${ButtonCss}
`
