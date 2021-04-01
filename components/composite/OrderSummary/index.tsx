import {
  LineItemsContainer,
  LineItemsCount,
  TaxesAmount,
  ShippingAmount,
  TotalAmount,
  PaymentMethodAmount,
} from "@commercelayer/react-components"
import { useTranslation } from "react-i18next"

import "twin.macro"
import { LineItemTypes } from "./LineItemTypes"

export const OrderSummary: React.FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <LineItemsContainer>
        <h4 tw="text-lg mb-7 font-bold" data-cy="test-summary">
          <LineItemsCount>
            {(props) => t("orderRecap.cartContains", { count: props.quantity })}
          </LineItemsCount>
        </h4>
        <LineItemTypes type="skus" />
        <LineItemTypes type="gift_cards" />
      </LineItemsContainer>
      <div tw="pt-3 pb-3 w-1/2 flex flex-col ml-auto">
        <h2 tw="text-sm font-bold flex flex-row justify-between pb-2">
          {t("orderRecap.tax_amount")}
          <TaxesAmount />
        </h2>
        <h2 tw="text-sm font-bold flex flex-row justify-between pb-2">
          {t("orderRecap.shipping_amount")}
          <ShippingAmount />
        </h2>
        <h2 tw="text-sm font-bold flex flex-row justify-between pb-2">
          {t("orderRecap.payment_method_amount")}
          <PaymentMethodAmount />
        </h2>
        <h4 tw="text-lg font-bold flex flex-row justify-between">
          {t("orderRecap.total_amount")}
          <TotalAmount />
        </h4>
      </div>
    </>
  )
}
