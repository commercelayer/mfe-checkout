import { AddressCollection } from "@commercelayer/js-sdk"
import {
  AddressesContainer,
  BillingAddressForm,
  AddressInput,
  SaveAddressesButton,
  ShippingAddressForm,
  CustomerContainer,
  BillingAddressContainer,
  Address,
  AddressField,
  ShippingAddressContainer,
} from "@commercelayer/react-components"
import { useState, Fragment } from "react"
import tw from "twin.macro"

import { useTranslation } from "components/data/i18n"
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
  isUsingNewBillingAddress: boolean
  isUsingNewShippingAddress: boolean
  isGuest: boolean
  emailAddress: string
  refetchOrder: () => void
}

export const CheckoutCustomerAddresses: React.FC<Props> = ({
  billingAddress,
  shippingAddress,
  isUsingNewBillingAddress,
  isUsingNewShippingAddress,
  hasSameAddresses,
  isGuest,
  emailAddress,
  refetchOrder,
}: Props) => {
  const { t } = useTranslation()

  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(
    !hasSameAddresses
  )
  const [showBillingAddressForm, setShowBillingAddressForm] = useState(
    isUsingNewBillingAddress
  )
  const [showShippingAddressForm, setShowShippingAddressForm] = useState(
    isUsingNewShippingAddress
  )

  const handleShowBillingForm = () =>
    setShowBillingAddressForm(!showBillingAddressForm)
  const handleShowShippingForm = () =>
    setShowShippingAddressForm(!showShippingAddressForm)

  return (
    <Fragment>
      <AddressSectionEmail isGuest={isGuest} emailAddress={emailAddress} />
      <CustomerContainer>
        <AddressesContainer shipToDifferentAddress={shipToDifferentAddress}>
          <AddressSectionTitle>
            {t(`addressForm.billing_address_title`)}
          </AddressSectionTitle>
          <BillingAddressContainer>
            <Address
              tw="w-1/2 p-2 mb-5 border rounded cursor-pointer hover:border-blue-500 shadow-sm"
              selectedClassName="border-blue-500"
              onSelect={refetchOrder}
              data-cy="customer-billing-address"
            >
              <div tw="flex font-bold">
                <AddressField name="first_name" />
                <AddressField name="last_name" tw="ml-1" />
              </div>
              <div>
                <AddressField name="full_address" />
              </div>
            </Address>
          </BillingAddressContainer>
          <AddressButtonAddNew onClick={handleShowBillingForm}>
            {t("stepCustomer.addNewAddress")}
          </AddressButtonAddNew>
          {showBillingAddressForm ? (
            <BillingAddressForm autoComplete="on" className="p-2">
              <BillingAddressFormNew
                billingAddress={billingAddress}
                isUsingNewBillingAddress={isUsingNewBillingAddress}
              />
              <AddressSectionSaveOnAddressBook>
                <AddressInput
                  data-cy="billing_address_save_to_customer_address_book"
                  name="billing_address_save_to_customer_address_book"
                  type="checkbox"
                  tw="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400 align-middle"
                  required={false}
                />
                {" " + t("stepCustomer.saveAddressBook")}
              </AddressSectionSaveOnAddressBook>
            </BillingAddressForm>
          ) : (
            <Fragment />
          )}
          <Toggle
            data-cy="button-ship-to-different-address"
            data-status={shipToDifferentAddress}
            label={t(`addressForm.ship_to_different_address`)}
            checked={shipToDifferentAddress}
            onChange={() => setShipToDifferentAddress(!shipToDifferentAddress)}
          />
          {shipToDifferentAddress ? (
            <Fragment>
              <ShippingAddressContainer>
                <div tw="pl-2 pt-4">
                  <AddressSectionTitle>
                    {t(`addressForm.shipping_address_title`)}
                  </AddressSectionTitle>
                </div>
                <Address
                  data-cy="customer-shipping-address"
                  tw="w-1/2 p-2 m-2 border rounded cursor-pointer hover:border-blue-500 shadow-sm"
                  selectedClassName="border-blue-500"
                  onSelect={refetchOrder}
                >
                  <div tw="flex font-bold">
                    <AddressField name="first_name" />
                    <AddressField name="last_name" tw="ml-1" />
                  </div>
                  <div>
                    <AddressField name="full_address" />
                  </div>
                </Address>
              </ShippingAddressContainer>
              <AddressButtonAddNew onClick={handleShowShippingForm}>
                {t("stepCustomer.addNewAddress")}
              </AddressButtonAddNew>
            </Fragment>
          ) : (
            <Fragment />
          )}
          {showShippingAddressForm ? (
            <ShippingAddressForm
              autoComplete="on"
              hidden={!shipToDifferentAddress}
              className="p-2"
            >
              <ShippingAddressFormNew
                shippingAddress={shippingAddress}
                isGuest={false}
                isUsingNewShippingAddress={isUsingNewShippingAddress}
              />

              <AddressSectionSaveOnAddressBook>
                <AddressInput
                  data-cy="billing_address_save_to_customer_address_book"
                  name="billing_address_save_to_customer_address_book"
                  type="checkbox"
                  tw="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400 align-middle"
                  required={false}
                />
                {" " + t("stepCustomer.saveAddressBook")}
              </AddressSectionSaveOnAddressBook>
            </ShippingAddressForm>
          ) : (
            <Fragment />
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
      </CustomerContainer>
    </Fragment>
  )
}
