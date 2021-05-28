import {
  PaymentSourceBrandIcon,
  PaymentSourceBrandName,
  PaymentSourceDetail,
  PaymentSourceEditButton,
} from "@commercelayer/react-components"
import { Fragment } from "react"
import { Trans, useTranslation } from "react-i18next"
import "twin.macro"

interface Props {
  hasEditButton?: boolean
}

export const PaymentDetails: React.FC<Props> = ({ hasEditButton = false }) => {
  const { t } = useTranslation()

  return (
    <Fragment>
      <div className="flex flex-col lg:items-center lg:flex-row">
        <div className="flex items-center font-bold">
          <PaymentSourceBrandIcon className="mr-2" />
          <Trans t={t} i18nKey="stepPayment.endingIn">
            <PaymentSourceBrandName className="mr-1" />
            <PaymentSourceDetail className="ml-1" type="last4" />
          </Trans>
        </div>
        <div className="pl-10 text-gray-500 lg:pl-2">
          {t("stepPayment.expires")} <PaymentSourceDetail type="expMonth" />
          /
          <PaymentSourceDetail type="expYear" />
        </div>
      </div>
      {hasEditButton && (
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
