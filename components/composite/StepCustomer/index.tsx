import { useContext } from "react"

import "twin.macro"
import { AppContext } from "components/data/AppProvider"
import { useTranslation } from "components/data/i18n"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"

import { FormAddresses } from "./FormAddresses"

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
  const { hasShippingAddress, hasBillingAddress, isGuest } = appCtx

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
          <FormAddresses isGuest={isGuest} />
        ) : (
          <div>
            {hasShippingAddress && hasBillingAddress ? (
              <div>Hello, you have both shipping and billing address set</div>
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
