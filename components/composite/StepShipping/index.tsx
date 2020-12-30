import { useContext } from "react"

import "twin.macro"
import { AppContext } from "components/data/AppProvider"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"

import { useTranslation } from "../../../i18n"

interface Props {
  className?: string
}

export const StepShipping: React.FC<Props> = ({ className }) => {
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
        status={hasShippingMethod ? "done" : "add"}
        label={t("stepShipping.delivery")}
        info={t("stepShipping.summary")}
      />
      <StepContent>
        {hasShippingMethod ? (
          <div>{t("stepShipping.shippingMethod")}</div>
        ) : (
          <div>{t("stepShipping.addShippingMethod")}</div>
        )}
      </StepContent>
    </div>
  )
}
