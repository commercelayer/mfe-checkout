import { AddressCollection } from "@commercelayer/js-sdk"
import {
  AddressesContainer,
  BillingAddressForm,
  SaveAddressesButton,
  ShippingAddressForm,
  BillingAddressContainer,
  ShippingAddressContainer,
} from "@commercelayer/react-components"
import { Transition } from "@headlessui/react"
import { useState, Fragment, useEffect } from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

import "twin.macro"
import { AddButton } from "components/ui/AddButton"
import { ButtonCss, ButtonWrapper } from "components/ui/Button"
import { CustomerAddressCard } from "components/ui/CustomerAddressCard"
import { GridContainer } from "components/ui/GridContainer"
import { SpinnerIcon } from "components/ui/SpinnerIcon"
import { Toggle } from "components/ui/Toggle"

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

  const [billingAddressFill, setBillingAddressFill] =
    useState<AddressCollection | null>(billingAddress)
  const [shippingAddressFill, setShippingAddressFill] =
    useState<AddressCollection | null>(shippingAddress)

  const [shipToDifferentAddress, setShipToDifferentAddress] = useState<boolean>(
    !hasSameAddresses
  )

  const [showBillingAddressForm, setShowBillingAddressForm] = useState<boolean>(
    isUsingNewBillingAddress
  )
  const [showShippingAddressForm, setShowShippingAddressForm] =
    useState<boolean>(isUsingNewShippingAddress)

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
      <AddressesContainer shipToDifferentAddress={shipToDifferentAddress}>
        <>
          <AddressSectionTitle>
            {t(`addressForm.billing_address_title`)}
          </AddressSectionTitle>
          {hasCustomerAddresses && (
            <>
              <Transition
                show={!showBillingAddressForm}
                enter="transition-opacity duration-75"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <GridContainer className="mb-4">
                  <BillingAddressContainer>
                    <CustomerAddressCard
                      addressType="billing"
                      deselect={showBillingAddressForm}
                      onSelect={() =>
                        showBillingAddressForm &&
                        setShowBillingAddressForm(false)
                      }
                    />
                  </BillingAddressContainer>
                </GridContainer>
              </Transition>

              {!showBillingAddressForm && hasCustomerAddresses && (
                <AddButton
                  dataCy="add_new_billing_address"
                  action={handleShowBillingForm}
                />
              )}
            </>
          )}
        </>
        <div
          className={
            showBillingAddressForm || !hasCustomerAddresses ? "mt-4" : "hidden"
          }
        >
          <Transition
            show={showBillingAddressForm}
            enter="transition-opacity duration-75"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
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
                  <label onClick={() => setShowBillingAddressForm(false)}>
                    Chiudi
                  </label>
                </>
              ) : (
                <Fragment />
              )}
            </BillingAddressForm>
          </Transition>
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

            <div className={`${shipToDifferentAddress ? "" : "hidden"} mb-2`}>
              <AddressSectionTitle>
                {t(`addressForm.shipping_address_title`)}
              </AddressSectionTitle>
            </div>

            <div
              className={`${
                shipToDifferentAddress && hasCustomerAddresses
                  ? "mb-4"
                  : "hidden"
              }`}
            >
              <Transition
                show={!showShippingAddressForm}
                enter="transition-opacity duration-75"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <ShippingAddressContainer>
                  <GridContainer className="mb-4">
                    <CustomerAddressCard
                      addressType="shipping"
                      deselect={showShippingAddressForm}
                      onSelect={() =>
                        showShippingAddressForm &&
                        setShowShippingAddressForm(false)
                      }
                    />
                  </GridContainer>

                  {!showShippingAddressForm && (
                    <AddButton
                      dataCy="add_new_shipping_address"
                      action={handleShowShippingForm}
                    />
                  )}
                </ShippingAddressContainer>
              </Transition>
            </div>

            <div className={showShippingAddressForm ? "mt-4" : "hidden"}>
              <Transition
                show={showShippingAddressForm}
                enter="transition-opacity duration-75"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <ShippingAddressForm
                  autoComplete="on"
                  hidden={!shipToDifferentAddress}
                  reset={!showShippingAddressForm}
                  errorClassName="hasError"
                  className="pt-2"
                >
                  {showShippingAddressForm ? (
                    <>
                      <ShippingAddressFormNew
                        shippingAddress={shippingAddressFill}
                      />
                      <div className="mb-4">
                        <AddressSectionSaveOnAddressBook addressType="shipping" />
                      </div>
                      <label onClick={() => setShowShippingAddressForm(false)}>
                        Chiudi
                      </label>
                    </>
                  ) : (
                    <Fragment />
                  )}
                </ShippingAddressForm>
              </Transition>
            </div>
          </>
        )}
        <AddressSectionSaveForm>
          <ButtonWrapper>
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
          </ButtonWrapper>
        </AddressSectionSaveForm>
      </AddressesContainer>
    </Fragment>
  )
}

const StyledSaveAddressesButton = styled(SaveAddressesButton)`
  ${ButtonCss}
`
