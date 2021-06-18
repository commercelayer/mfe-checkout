import { Address, AddressField } from "@commercelayer/react-components"
import classNames from "classnames"
import { Fragment, useContext, useState } from "react"
import { useTranslation } from "react-i18next"

import "twin.macro"
import { AppContext } from "components/data/AppProvider"
import { StepContainer } from "components/ui/StepContainer"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"

import { CheckoutAddresses } from "./CheckoutAddresses"
import { CheckoutCustomerAddresses } from "./CheckoutCustomerAddresses"

interface Props {
  className?: string
  isActive?: boolean
  lastActivableStep?: SingleStepEnum
  onToggleActive?: () => void
  step: number
}

export const StepHeaderCustomer: React.FC<Props> = ({
  onToggleActive,
  isActive,
  lastActivableStep,
  step,
}) => {
  const appCtx = useContext(AppContext)
  if (!appCtx) {
    return null
  }

  const {
    billingAddress,
    shippingAddress,
    hasShippingAddress,
    hasBillingAddress,
    hasSameAddresses,
    isShipmentRequired,
  } = appCtx

  const { t } = useTranslation()

  const recapText = () => {
    if (!hasShippingAddress && !hasBillingAddress) {
      return "No Billing / Shipping Address set"
    }
    if (billingAddress && (hasSameAddresses || !isShipmentRequired)) {
      return (
        <Address addresses={[billingAddress]}>
          {
            <AddressField>
              {({ address }) => (
                <p data-cy="full-billing-information">{address.name} </p>
              )}
            </AddressField>
          }
        </Address>
      )
    }
    return (
      (billingAddress && shippingAddress && (
        <>
          <Address addresses={[billingAddress]} className="mb-1">
            {
              <AddressField>
                {({ address }) => (
                  <>
                    <p data-cy="full-billing-information">{address.name} </p>
                  </>
                )}
              </AddressField>
            }
          </Address>
          <Address addresses={[shippingAddress]}>
            {
              <AddressField>
                {({ address }) => (
                  <p data-cy="full-shipping-information">
                    <span className="font-semibold text-black">
                      {t(`addressForm.shipped_to`)}
                    </span>{" "}
                    {address.name}{" "}
                  </p>
                )}
              </AddressField>
            }
          </Address>
        </>
      )) ||
      ""
    )
  }

  const status = () => {
    if (isActive) {
      return "edit"
    }
    if (lastActivableStep === "Customer") {
      return "disabled"
    }
    return "done"
  }

  return (
    <StepHeader
      stepNumber={step}
      status={status()}
      label={t("stepCustomer.title")}
      info={recapText()}
      onEditRequest={
        onToggleActive
          ? () => {
              onToggleActive()
            }
          : undefined
      }
    />
  )
}

export const StepCustomer: React.FC<Props> = ({ isActive }) => {
  const appCtx = useContext(AppContext)

  const [isLocalLoader, setIsLocalLoader] = useState(false)

  if (!appCtx) {
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
      <StepContent>
        {isActive && (
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
