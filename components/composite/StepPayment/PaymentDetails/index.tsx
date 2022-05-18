import {
  PaymentSourceBrandIcon,
  PaymentSourceBrandName,
  PaymentSourceDetail,
  PaymentSourceEditButton,
} from "@commercelayer/react-components"
import { Fragment, useContext } from "react"
import { Trans, useTranslation } from "react-i18next"

import { AppContext } from "components/data/AppProvider"
import { getTranslations } from "components/utils/payments"

interface Props {
  hasEditButton?: boolean
}

export const PaymentDetails: React.FC<Props> = ({ hasEditButton = false }) => {
  const { t } = useTranslation()

  const appCtx = useContext(AppContext)

  if (!appCtx) {
    return null
  }

  const { isCreditCard } = appCtx

  return (
    <Fragment>
      <div className="flex flex-col lg:items-center lg:flex-row">
        <div className="flex items-center font-bold">
          <PaymentSourceBrandIcon className="mr-2" />
          <PaymentSourceBrandName className="mr-1">
            {(p) => {
              if (isCreditCard) {
                return (
                  <Trans i18nKey="stepPayment.endingIn">
                    <>{p?.brand}</>
                    <PaymentSourceDetail className="ml-1" type="last4" />
                  </Trans>
                )
              }
              return <>{getTranslations(p?.brand, t)}</>
            }}
          </PaymentSourceBrandName>
        </div>
        {isCreditCard && (
          <div className="pl-10 text-gray-400 lg:pl-2">
            {t("stepPayment.expires")} <PaymentSourceDetail type="exp_month" />
            /
            <PaymentSourceDetail type="exp_year" />
          </div>
        )}
      </div>
      {isCreditCard && hasEditButton && (
        <div className="ml-10 lg:ml-3">
          <PaymentSourceEditButton
            label={t("general.edit")}
            className="text-sm font-bold leading-none border-b border-black text-primary border-opacity-10 md: transition ease-in duration-200 hover:border-opacity-50 hover:text-primary-dark focus:outline-none"
          />
        </div>
      )}
    </Fragment>
  )
}
