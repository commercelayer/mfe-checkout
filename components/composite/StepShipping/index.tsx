import { useContext } from "react"

import "twin.macro"
import { AppContext } from "components/data/AppProvider"
import { useTranslation } from "components/data/i18n"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"

interface Props {
  className?: string
  isActive?: boolean
  onToggleActive: () => void
}

export const StepShipping: React.FC<Props> = ({
  className,
  isActive,
  onToggleActive,
}) => {
  const appCtx = useContext(AppContext)
  const { t } = useTranslation()

  if (!appCtx || !appCtx.hasShippingAddress) {
    return null
  }

  const { hasShippingMethod } = appCtx

  return (
    <div className={className}>
      <StepHeader
        stepNumber={2}
        status={isActive ? "edit" : "done"}
        label={t("stepShipping.delivery")}
        info={
          isActive
            ? t("stepShipping.summary")
            : "Metodo di spedizione selezionato"
        }
        onEditRequest={() => {
          onToggleActive()
        }}
      />
      <StepContent>
        {isActive ? (
          "Seleziona...."
        ) : hasShippingMethod ? (
          <div>
            {/* {t("stepShipping.shippingMethod")} */}
            {"Selezionato"}
          </div>
        ) : (
          <div>-</div>
        )}
      </StepContent>
    </div>
  )
}
