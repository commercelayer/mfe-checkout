import { useContext } from "react"

import "twin.macro"

import { AppContext } from "components/data/AppProvider"
import { useTranslation } from "components/data/i18n"
import { Button } from "components/ui/Button"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"

interface Props {
  className?: string
  isActive?: boolean
  onToggleActive: () => void
}

export const StepPayment: React.FC<Props> = ({
  className,
  isActive,
  onToggleActive,
}) => {
  const appCtx = useContext(AppContext)
  const { t } = useTranslation()

  if (!appCtx || !appCtx.hasShippingMethod) {
    return null
  }

  const { hasPaymentMethod } = appCtx

  return (
    <div className={className}>
      <StepHeader
        stepNumber={2}
        status={isActive ? "edit" : "done"}
        label={t("stepPayment.title")}
        info={
          isActive
            ? t("stepPayment.summary")
            : "Metodo di pagamento selezionato"
        }
        onEditRequest={() => {
          onToggleActive()
        }}
      />
      <StepContent>
        {isActive ? (
          <div>Seleziona il metodo di pagamento</div>
        ) : hasPaymentMethod ? (
          <div>{"Selezionato"}</div>
        ) : (
          <div>Metodo di pagamento da selezionare</div>
        )}
      </StepContent>
    </div>
  )
}
