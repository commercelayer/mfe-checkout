// import { Address, AddressField } from "@commercelayer/react-components"
import classNames from "classnames"
import { Fragment, useContext, useState } from "react"
import { useTranslation } from "react-i18next"

import { AccordionContext } from "components/data/AccordionProvider"
import { AppContext } from "components/data/AppProvider"
import { StepContainer } from "components/ui/StepContainer"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"

import { CheckoutAddresses } from "./CheckoutAddresses"
import { CheckoutCustomerAddresses } from "./CheckoutCustomerAddresses"

interface Props {
  className?: string
  step: number
}

export const StepHeaderCustomer: React.FC<Props> = ({ step }) => {
  const appCtx = useContext(AppContext)
  const accordionCtx = useContext(AccordionContext)
  if (!appCtx || !accordionCtx) {
    return null
  }

  const {
    // billingAddress,
    // shippingAddress,
    // hasSameAddresses,
    // isShipmentRequired,
    hasShippingAddress,
    hasBillingAddress,
    emailAddress,
  } = appCtx

  const { t } = useTranslation()

  const recapText = () => {
    if (
      (!hasShippingAddress && !hasBillingAddress) ||
      accordionCtx.status === "edit"
    ) {
      return <p>{t("stepCustomer.notSet")}</p>
    }

    return <p data-cy="customer-email-step-header">{emailAddress}</p>
  }

  return (
    <StepHeader
      stepNumber={step}
      status={accordionCtx.status}
      label={t("stepCustomer.title")}
      info={recapText()}
      onEditRequest={accordionCtx.setStep}
    />
  )
}

export const StepCustomer: React.FC<Props> = () => {
  const appCtx = useContext(AppContext)
  const accordionCtx = useContext(AccordionContext)

  const [isLocalLoader, setIsLocalLoader] = useState(false)

  if (!appCtx || !accordionCtx) {
    return null
  }
  const {
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

    // it is used temporarily to scroll
    // to the next step and fix
    // the mobile and desktop bug that led to the bottom of the page
    const tab = document.querySelector('div[tabindex="2"]')
    const top = tab?.scrollLeft as number
    const left = tab?.scrollTop as number
    window.scrollTo({ left, top: top, behavior: "smooth" })

    setIsLocalLoader(false)
  }

  // todo: logica interna da implementare
  // se guest e' true: mostrare input email + form indirizzi
  // altrimenti mostrare elenco indirizzi della rubrica + pulsante aggiungi nuovo indirizzo
  // se non ci sono indirizzi in rubrica, ma solo l'indirizzo dell'ordine (non ancora salvato in rubrica) si mostra il form con i valori in edit

  return (
    <StepContainer
      className={classNames({
        current: accordionCtx.isActive,
        done: !accordionCtx.isActive,
        submitting: isLocalLoader,
      })}
    >
      <StepContent>
        {accordionCtx.isActive && (
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
        )}
      </StepContent>
    </StepContainer>
  )
}
