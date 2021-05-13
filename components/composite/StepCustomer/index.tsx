import { Address, AddressField } from "@commercelayer/react-components"
import { Fragment, useContext, useState } from "react"
import { useTranslation } from "react-i18next"
import "twin.macro"

import { AppContext } from "components/data/AppProvider"
import { FlexContainer } from "components/ui/FlexContainer"
import { StepContainer } from "components/ui/StepContainer"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"
import { StepLine } from "components/ui/StepLine"

import { AddressSectionEmail } from "./AddressSectionEmail"
import { AddressSectionTitle } from "./AddressSectionTitle"
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

  const [isLocalLoader, setIsLocalLoader] = useState(false)

  if (!appCtx) {
    return null
  }
  const {
    hasShippingAddress,
    hasBillingAddress,
    isGuest,
    isShipmentRequired,
    billingAddress,
    shippingAddress,
    emailAddress,
    hasSameAddresses,
    isUsingNewBillingAddress,
    isUsingNewShippingAddress,
    hasCustomerAddresses,
    refetchOrder,
  } = appCtx

  const handleSave = async () => {
    setIsLocalLoader(true)
    await refetchOrder()
    setIsLocalLoader(false)
  }

  // todo: logica interna da implementare
  // se guest e' true: mostrare input email + form indirizzi
  // altrimenti mostrare elenco indirizzi della rubrica + pulsante aggiungi nuovo indirizzo
  // se non ci sono indirizzi in rubrica, ma solo l'indirizzo dell'ordine (non ancora salvato in rubrica) si mostra il form con i valori in edit

  return (
    <StepContainer>
      <StepLine />
      <StepContent>
        <StepHeader
          stepNumber={1}
          status={isActive ? "edit" : "done"}
          label={t("stepCustomer.title")}
          info={
            isActive ? t("stepCustomer.summary") : t("stepCustomer.information")
          }
          onEditRequest={() => {
            onToggleActive()
          }}
        />
        {isActive ? (
          <Fragment>
            {isGuest ? (
              <CheckoutAddresses
                shippingAddress={shippingAddress}
                billingAddress={billingAddress}
                emailAddress={emailAddress}
                isGuest={isGuest}
                hasSameAddresses={hasSameAddresses}
                isShipmentRequired={isShipmentRequired}
                isLocalLoader={isLocalLoader}
                handleSave={handleSave}
              />
            ) : (
              <CheckoutCustomerAddresses
                shippingAddress={shippingAddress}
                billingAddress={billingAddress}
                emailAddress={emailAddress}
                isGuest={isGuest}
                hasCustomerAddresses={hasCustomerAddresses}
                isShipmentRequired={isShipmentRequired}
                isUsingNewShippingAddress={isUsingNewShippingAddress}
                isUsingNewBillingAddress={isUsingNewBillingAddress}
                hasSameAddresses={hasSameAddresses}
                isLocalLoader={isLocalLoader}
                handleSave={handleSave}
              />
            )}
          </Fragment>
        ) : (
          <div>
            <AddressSectionEmail
              isGuest={isGuest}
              emailAddress={emailAddress}
            />
            <FlexContainer className="flex-col md:flex-row">
              {billingAddress && (
                <div className="w-full md:w-2/4">
                  <AddressSectionTitle>
                    {t(`addressForm.billed_to`)}
                  </AddressSectionTitle>
                  <Address
                    addresses={[billingAddress]}
                    className="p-3 border rounded md:mr-4 shadow-sm"
                  >
                    <AddressField
                      tw="pl-1 font-bold"
                      name="full_name"
                      data-cy="fullname_billing"
                      className="flex font-bold text-md"
                    />

                    <AddressField
                      tw="pl-1"
                      name="full_address"
                      data-cy="full_address_billing"
                      className="text-sm text-gray-600"
                    />
                  </Address>
                </div>
              )}
              {isShipmentRequired && shippingAddress && (
                <div className="w-full mt-4 md:w-2/4 md:mt-0">
                  <AddressSectionTitle>
                    {t(`addressForm.shipped_to`)}
                  </AddressSectionTitle>
                  <Address
                    addresses={[shippingAddress]}
                    className="p-3 border rounded shadow-sm"
                  >
                    <AddressField
                      tw="pl-1 font-bold"
                      name="full_name"
                      data-cy="fullname_shipping"
                      className="flex font-bold text-md"
                    />

                    <AddressField
                      tw="pl-1"
                      name="full_address"
                      data-cy="full_address_shipping"
                      className="text-sm text-gray-600"
                    />
                  </Address>
                </div>
              )}
            </FlexContainer>

            {!hasShippingAddress && !hasBillingAddress ? (
              <div>No Billing / Shipping Address set</div>
            ) : null}
          </div>
        )}
      </StepContent>
    </StepContainer>
  )
}
