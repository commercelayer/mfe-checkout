import { useContext, useEffect, useState } from "react"

import "twin.macro"
import { AppContext } from "components/data/AppProvider"
import { useTranslation } from "components/data/i18n"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"

import { FormAddresses } from "./FormAddresses"

interface Props {
  className?: string
}

export const StepCustomer: React.FC<Props> = ({ className }) => {
  const appCtx = useContext(AppContext)
  const { t } = useTranslation()

  const [showForm, setShowForm] = useState(false)

  if (!appCtx) {
    return null
  }
  const { hasShippingAddress, hasBillingAddress } = appCtx

  useEffect(() => {
    if (appCtx) {
      setShowForm(!(hasShippingAddress || hasBillingAddress))
    }
  }, [appCtx])

  return (
    <div className={className}>
      <StepHeader
        stepNumber={1}
        status={showForm ? "add" : "done"}
        label={t("stepCustomer.customer")}
        info={t("stepCustomer.bill")}
        onEditRequest={() => {
          setShowForm(true)
        }}
      />
      <StepContent>
        {showForm ? (
          <FormAddresses />
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
