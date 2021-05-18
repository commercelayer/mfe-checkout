import { Fragment, useContext, useState } from "react"
import { useTranslation } from "react-i18next"
import "twin.macro"

import { AppContext } from "components/data/AppProvider"
import { CustomerAddressCard } from "components/ui/CustomerAddressCard"
import { GridContainer } from "components/ui/GridContainer"
import { StepContainer } from "components/ui/StepContainer"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"
import { StepLine } from "components/ui/StepLine"

import { AddressSectionEmail } from "./AddressSectionEmail"
import { AddressSectionTitle } from "./AddressSectionTitle"
import { CheckoutAddresses } from "./CheckoutAddresses"
import { CheckoutCustomerAddresses } from "./CheckoutCustomerAddresses"

import classNames from "classnames"

interface Props {
  className?: string
  isActive?: boolean
  onToggleActive: () => void
}

export const StepCustomer: React.FC<Props> = ({ isActive, onToggleActive }) => {
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
    <StepContainer
      className={classNames({
        current: isActive,
        done: !isActive,
        submitting: isLocalLoader,
      })}
    >
      <StepLine stepNumber={1} status={isActive ? "edit" : "done"} />
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
          <>
            <AddressSectionEmail readonly emailAddress={emailAddress} />
            <GridContainer>
              {billingAddress && (
                <div className="w-full">
                  <AddressSectionTitle>
                    {t(`addressForm.billed_to`)}
                  </AddressSectionTitle>
                  <CustomerAddressCard
                    addressType="billing"
                    deselect={true}
                    addresses={[billingAddress]}
                  />
                </div>
              )}
              {isShipmentRequired && shippingAddress && (
                <div className="w-full">
                  <AddressSectionTitle>
                    {t(`addressForm.shipped_to`)}
                  </AddressSectionTitle>
                  <CustomerAddressCard
                    addressType="shipping"
                    deselect={true}
                    addresses={[shippingAddress]}
                  />
                </div>
              )}
            </GridContainer>

            {!hasShippingAddress && !hasBillingAddress ? (
              <div>No Billing / Shipping Address set</div>
            ) : null}
          </>
        )}
      </StepContent>
    </StepContainer>
  )
}
