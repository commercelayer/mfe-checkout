import { Address, AddressField } from "@commercelayer/react-components"
import { Fragment, useContext } from "react"

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
    refetchOrder,
  } = appCtx

  // MOCKED STATE
  const hasAddressInOrder = hasShippingAddress && hasBillingAddress // ma non in rubrica

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
        info={isActive ? t("stepCustomer.bill") : ""}
        onEditRequest={() => {
          onToggleActive()
        }}
      />
      <StepContent>
        {isActive ? (
          <Fragment>
            {isGuest && (
              <CheckoutAddresses
                shippingAddress={shippingAddress}
                billingAddress={billingAddress}
                emailAddress={emailAddress}
                isGuest={isGuest}
                refetchOrder={refetchOrder}
              />
            )}
            {!isGuest && (
              <CheckoutCustomerAddresses
                shippingAddress={shippingAddress}
                billingAddress={billingAddress}
                refetchOrder={refetchOrder}
              />
            )}
          </Fragment>
        ) : (
          <div>
            {hasShippingAddress && hasBillingAddress ? (
              <div>
                Hello, you have both shipping and billing address set:
                <Address addresses={[billingAddress as any]}>
                  <div tw="flex flex-row">
                    Fatturazione:
                    <AddressField tw="pl-1" name="full_address" />
                  </div>
                </Address>
                <Address addresses={[shippingAddress as any]}>
                  <div tw="flex flex-row">
                    Spedizione:
                    <AddressField tw="pl-1" name="full_address" />
                  </div>
                </Address>
              </div>
            ) : hasShippingAddress ? (
              <div>Hello, you have only shipping address set</div>
            ) : hasBillingAddress ? (
              <div>Hello, you have only billing address set</div>
            ) : (
              <div>No Billing / Shipping Address set</div>
            )}
          </div>
        )}
      </StepContent>
    </div>
  )
}
