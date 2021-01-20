import { AddressCollection } from "@commercelayer/js-sdk"
import { SingleRelationship } from "@commercelayer/js-sdk/dist/resources/typings/Library"
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
import styled from "styled-components"
import tw from "twin.macro"

import { useTranslation } from "components/data/i18n"
import { Toggle } from "components/ui/Toggle"

import { AddressButtonAddNew } from "./AddressButtonAddNew"
import { AddressInputGroup } from "./AddressInputGroup"
import { AddressSectionSaveForm } from "./AddressSectionSaveForm"
import { AddressSectionSaveOnBook } from "./AddressSectionSaveOnBook"
import { AddressSectionTitle } from "./AddressSectionTitle"

interface Props {
  billingAddress: AddressCollection
  shippingAddress: SingleRelationship<AddressCollection>
  refetchOrder: () => void
}

export const CheckoutCustomerAddresses: React.FC<Props> = ({
  refetchOrder,
}: Props) => {
  const { t } = useTranslation()

  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false)
  const [showBillingAddressForm, setShowBillingAddressForm] = useState(false)
  const [showShippingAddressForm, setShowShippingAddressForm] = useState(false)

  const handleShowBillingForm = () =>
    setShowBillingAddressForm(!showBillingAddressForm)
  const handleShowShippingForm = () =>
    setShowShippingAddressForm(!showShippingAddressForm)

  return (
    <Fragment>
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
              <Grid>
                <AddressInputGroup
                  fieldName="billing_address_first_name"
                  resource="billingAddress"
                  type="text"
                />
                <AddressInputGroup
                  fieldName="billing_address_last_name"
                  resource="billingAddress"
                  type="text"
                />
              </Grid>
              <AddressInputGroup
                fieldName="billing_address_line_1"
                resource="billingAddress"
                type="text"
              />
              <Grid>
                <AddressInputGroup
                  fieldName="billing_address_city"
                  resource="billingAddress"
                  type="text"
                />
                <AddressInputGroup
                  fieldName="billing_address_country_code"
                  resource="billingAddress"
                  type="text"
                />
              </Grid>
              <Grid>
                <AddressInputGroup
                  fieldName="billing_address_state_code"
                  resource="billingAddress"
                  type="text"
                />
                <AddressInputGroup
                  fieldName="billing_address_zip_code"
                  resource="billingAddress"
                  type="text"
                />
              </Grid>
              <AddressInputGroup
                fieldName="billing_address_phone"
                resource="billingAddress"
                type="tel"
              />
              <AddressSectionSaveOnBook>
                <AddressInput
                  data-cy="billing_address_save_to_customer_book"
                  name="billing_address_save_to_customer_book"
                  type="checkbox"
                  tw="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400 align-middle"
                  required={false}
                />
                {" " + t("stepCustomer.saveAddressBook")}
              </AddressSectionSaveOnBook>
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
              <Grid>
                <AddressInputGroup
                  fieldName="shipping_address_first_name"
                  resource="shippingAddress"
                  type="text"
                />

                <AddressInputGroup
                  fieldName="shipping_address_last_name"
                  resource="shippingAddress"
                  type="text"
                />
              </Grid>

              <AddressInputGroup
                fieldName="shipping_address_line_1"
                resource="shippingAddress"
                type="text"
              />

              <Grid>
                <AddressInputGroup
                  fieldName="shipping_address_city"
                  resource="shippingAddress"
                  type="text"
                />

                <AddressInputGroup
                  fieldName="shipping_address_country_code"
                  resource="shippingAddress"
                  type="text"
                />
              </Grid>

              <Grid>
                <AddressInputGroup
                  fieldName="shipping_address_state_code"
                  resource="shippingAddress"
                  type="text"
                />

                <AddressInputGroup
                  fieldName="shipping_address_zip_code"
                  resource="shippingAddress"
                  type="text"
                />
              </Grid>

              <AddressInputGroup
                fieldName="shipping_address_phone"
                resource="shippingAddress"
                type="tel"
              />
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

const Grid = styled.div`
  ${tw`grid grid-cols-2 gap-4`}
`
