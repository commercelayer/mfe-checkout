import { TaxesAmount, TotalAmount } from "@commercelayer/react-components"

import { useTranslation } from "components/data/i18n"

import "twin.macro"

export const OrderTotalAmount: React.FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <div tw="pb-3">
        <h2 tw="text-sm font-bold flex flex-row justify-between pb-2">
          {t("orderRecap.tax_amount")}
          <TaxesAmount />
        </h2>
        <h4 tw="text-lg font-bold flex flex-row justify-between">
          {t("orderRecap.total_amount")}
          <TotalAmount />
        </h4>
      </div>
      <hr />
    </>
  )
}
