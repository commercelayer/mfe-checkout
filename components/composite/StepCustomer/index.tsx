import { useContext } from "react"

import "twin.macro"
import { AppContext } from "components/data/AppProvider"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"

import { useTranslation } from "../../../i18n"

interface Props {
  className?: string
}

export const StepCustomer: React.FC<Props> = ({ className }) => {
  const appCtx = useContext(AppContext)
  const { t } = useTranslation()

  if (!appCtx) {
    return null
  }
  const { hasShippingAddress, hasBillingAddress } = appCtx

  return (
    <div className={className}>
      <StepHeader
        stepNumber={1}
        status={hasShippingAddress ? "done" : "add"}
        label={t("stepCustomer.customer")}
        info={t("stepCustomer.bill")}
      />
      <StepContent>
        {hasShippingAddress && hasBillingAddress ? (
          <div>{t("stepCustomer.setBillAddressAndShipping")}</div>
        ) : hasShippingAddress ? (
          <div>{t("stepCustomer.setOnlyAddressShipping")}</div>
        ) : hasBillingAddress ? (
          <div>{t("stepCustomer.settedOnlyBillingAddress")}</div>
        ) : (
          <div>{t("stepCustomer.noBillingOrShippingAddress")}</div>
        )}
      </StepContent>
    </div>
  )
}
