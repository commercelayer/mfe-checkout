import {
  AddressesContainer,
  BillingAddressForm,
  SaveAddressesButton,
  ShippingAddressForm,
} from "@commercelayer/react-components"
import type { Address, Order } from "@commercelayer/sdk"
import type { ShippingToggleProps } from "components/composite/StepCustomer"
import { ButtonCss, ButtonWrapper } from "components/ui/Button"
import { SpinnerIcon } from "components/ui/SpinnerIcon"
import { Toggle } from "components/ui/Toggle"
import {
  type Dispatch,
  Fragment,
  type SetStateAction,
  useEffect,
  useState,
} from "react"
import { useTranslation } from "react-i18next"
import { AddressSectionEmail } from "./AddressSectionEmail"
import { AddressSectionSaveForm } from "./AddressSectionSaveForm"
import { AddressSectionTitle } from "./AddressSectionTitle"
import { BillingAddressFormNew } from "./BillingAddressFormNew"
import { ShippingAddressFormNew } from "./ShippingAddressFormNew"

interface Props {
  billingAddress: NullableType<Address>
  shippingAddress: NullableType<Address>
  emailAddress: NullableType<string>
  hasSameAddresses: boolean
  isShipmentRequired: boolean
  isLocalLoader: boolean
  shipToDifferentAddress: boolean
  setShipToDifferentAddress: Dispatch<SetStateAction<boolean>>
  openShippingAddress: (props: ShippingToggleProps) => void
  disabledShipToDifferentAddress: boolean
  setCustomerEmail: (email: string) => void
  handleSave: (params: { success: boolean; order?: Order }) => void
}

export const CheckoutAddresses: React.FC<Props> = ({
  billingAddress,
  shippingAddress,
  emailAddress,
  hasSameAddresses,
  isShipmentRequired,
  isLocalLoader,
  shipToDifferentAddress,
  setShipToDifferentAddress,
  openShippingAddress,
  disabledShipToDifferentAddress,
  setCustomerEmail,
  handleSave,
}: Props) => {
  const { t } = useTranslation()

  const [shippingAddressFill, setShippingAddressFill] =
    useState<NullableType<Address>>(shippingAddress)

  const handleToggleDifferentAddress = () => {
    return [
      setShipToDifferentAddress(!shipToDifferentAddress),
      setShippingAddressFill(undefined),
    ]
  }

  useEffect(() => {
    if (shipToDifferentAddress && hasSameAddresses) {
      setShippingAddressFill(undefined)
    }
  }, [shipToDifferentAddress])

  return (
    <Fragment>
      <AddressSectionEmail
        emailAddress={emailAddress}
        setCustomerEmail={setCustomerEmail}
      />
      {/* Deprecated, and staying. The documented migration moves
          shipToDifferentAddress onto the two forms and drops the wrapper, but
          that only works when the save button is a child of a form. Here
          SaveAddressesButton is their sibling, and it reads `saveAddresses`
          from AddressContext — which this container is the only thing to
          provide. The forms even define standalone mode as
          `parentAddressContext.saveAddresses == null`, so going standalone
          guarantees the button gets nothing and silently does nothing on
          click. Unblocked only by the library exporting a provider. */}
      <AddressesContainer shipToDifferentAddress={shipToDifferentAddress}>
        <div className="mt-4">
          <AddressSectionTitle>
            <>{t("addressForm.billing_address_title")}</>
          </AddressSectionTitle>
        </div>
        <BillingAddressForm autoComplete="on" errorClassName="hasError">
          <div className="mt-4">
            <BillingAddressFormNew
              billingAddress={billingAddress}
              openShippingAddress={openShippingAddress}
            />
          </div>
        </BillingAddressForm>
        {isShipmentRequired && (
          <Toggle
            disabled={disabledShipToDifferentAddress}
            data-testid="button-ship-to-different-address"
            data-status={shipToDifferentAddress}
            label={t("addressForm.ship_to_different_address")}
            checked={shipToDifferentAddress}
            onChange={handleToggleDifferentAddress}
          />
        )}

        {isShipmentRequired && shipToDifferentAddress && (
          <ShippingAddressForm
            autoComplete="on"
            hidden={!shipToDifferentAddress}
            errorClassName="hasError"
          >
            <AddressSectionTitle>
              <>{t("addressForm.shipping_address_title")}</>
            </AddressSectionTitle>
            <div className="mt-4">
              <ShippingAddressFormNew shippingAddress={shippingAddressFill} />
            </div>
          </ShippingAddressForm>
        )}
        <AddressSectionSaveForm>
          <ButtonWrapper>
            <SaveAddressesButton
              className={ButtonCss}
              disabled={isLocalLoader}
              label={
                <>
                  {isLocalLoader && <SpinnerIcon />}
                  {isShipmentRequired
                    ? t("stepCustomer.continueToDelivery")
                    : t("stepShipping.continueToPayment")}
                </>
              }
              data-testid="save-customer-button"
              onClick={handleSave}
            />
          </ButtonWrapper>
        </AddressSectionSaveForm>
      </AddressesContainer>
    </Fragment>
  )
}
