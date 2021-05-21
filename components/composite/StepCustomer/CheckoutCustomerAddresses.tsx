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
import { SpinnerIcon } from "components/ui/SpinnerIcon"
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
      <AddressSectionEmail readonly emailAddress={emailAddress} />
      <CustomerContainer>
        <AddressesContainer shipToDifferentAddress={shipToDifferentAddress}>
          <>
            <AddressSectionTitle>
              {t(`addressForm.billing_address_title`)}
            </AddressSectionTitle>
            {showBillingAddressForm ? (
              <GridContainer className="mb-8">
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
            ) : null}
          </>
          <div
            className={
              showBillingAddressForm || !hasCustomerAddresses
                ? "mt-4"
                : "hidden"
            }
          >
            <BillingAddressForm
              autoComplete="on"
              reset={!showBillingAddressForm}
              errorClassName="hasError"
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

              <div className={`${shipToDifferentAddress ? "" : "hidden"} p-2`}>
                <AddressSectionTitle>
                  {t(`addressForm.shipping_address_title`)}
                </AddressSectionTitle>
              </div>

              <div
                className={`${
                  shipToDifferentAddress && hasCustomerAddresses ? "" : "hidden"
                }`}
              >
                <ShippingAddressContainer>
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
                  errorClassName="hasError"
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
                  {t("general.discard")}
                </AddressButtonAddNew>
              ) : null}
            </div>
            <AddressSectionSaveForm>
              <StyledSaveAddressesButton
                disabled={isLocalLoader}
                label={
                  <>
                    {isLocalLoader && <SpinnerIcon />}
                    {isShipmentRequired
                      ? t("stepCustomer.continueToDelivery")
                      : t("stepShipping.continueToPayment")}
                  </>
                }
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
