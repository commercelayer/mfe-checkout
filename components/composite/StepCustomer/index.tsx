import { Address, AddressField } from "@commercelayer/react-components"
import {
  faShippingFast,
  faAddressCard,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Fragment, useContext } from "react"
import styled from "styled-components"
import tw from "twin.macro"

import { AppContext } from "components/data/AppProvider"
import { useTranslation } from "components/data/i18n"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"

import { CheckoutAddresses } from "./CheckoutAddresses"
import { CheckoutCustomerAddresses } from "./CheckoutCustomerAddresses"

interface Props {
  className?: string
  isActive?: boolean
  onToggleActive: () => void
}

export const StepCustomer: React.FC<Props> = ({
  className,
  isActive,
  onToggleActive,
}) => {
  const appCtx = useContext(AppContext)
  const { t } = useTranslation()

  if (!appCtx) {
    return null
  }
  const {
    hasShippingAddress,
    hasBillingAddress,
    isGuest,
    billingAddress,
    shippingAddress,
    emailAddress,
    hasSameAddresses,
    isUsingNewBillingAddress,
    isUsingNewShippingAddress,
    refetchOrder,
  } = appCtx

  // todo: logica interna da implementare
  // se guest e' true: mostrare input email + form indirizzi
  // altrimenti mostrare elenco indirizzi della rubrica + pulsante aggiungi nuovo indirizzo
  // se non ci sono indirizzi in rubrica, ma solo l'indirizzo dell'ordine (non ancora salvato in rubrica) si mostra il form con i valori in edit

  return (
    <div className={className}>
      <StepHeader
        stepNumber={1}
        status={isActive ? "edit" : "done"}
        label={t("stepCustomer.customer")}
        info={
          isActive
            ? "Edit your billing and shipping address"
            : t("stepCustomer.bill")
        }
        onEditRequest={() => {
          onToggleActive()
        }}
      />
      <StepContent>
        {isActive ? (
          <Fragment>
            {isGuest ? (
              <CheckoutAddresses
                shippingAddress={shippingAddress}
                billingAddress={billingAddress}
                emailAddress={emailAddress}
                isGuest={isGuest}
                hasSameAddresses={hasSameAddresses}
                refetchOrder={refetchOrder}
              />
            ) : (
              <CheckoutCustomerAddresses
                shippingAddress={shippingAddress}
                billingAddress={billingAddress}
                emailAddress={emailAddress}
                isGuest={isGuest}
                isUsingNewShippingAddress={isUsingNewShippingAddress}
                isUsingNewBillingAddress={isUsingNewBillingAddress}
                hasSameAddresses={hasSameAddresses}
                refetchOrder={refetchOrder}
              />
            )}
          </Fragment>
        ) : (
          <div>
            <div>
              {billingAddress && (
                <Address addresses={[billingAddress]}>
                  <div tw="flex flex-row items-center">
                    <Icon>
                      <FontAwesomeIcon icon={faAddressCard} />
                    </Icon>
                    <AddressField
                      tw="pl-1"
                      name="full_address"
                      data-cy="full_address_billing"
                    />
                  </div>
                </Address>
              )}
              {shippingAddress && (
                <Address addresses={[shippingAddress]}>
                  <div tw="flex flex-row items-center ">
                    <Icon>
                      <FontAwesomeIcon icon={faShippingFast} />
                    </Icon>
                    <AddressField
                      tw="pl-1"
                      name="full_address"
                      data-cy="full_address_shipping"
                    />
                  </div>
                </Address>
              )}
            </div>

            {!hasShippingAddress && !hasBillingAddress ? (
              <div>No Billing / Shipping Address set</div>
            ) : null}
          </div>
        )}
      </StepContent>
    </div>
  )
}

const Icon = styled.div`
  ${tw`w-7 text-gray-600`}
`
