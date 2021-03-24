import {
  LineItemsContainer,
  LineItem,
  LineItemImage,
  LineItemName,
  LineItemQuantity,
  LineItemAmount,
  LineItemsCount,
  TaxesAmount,
  ShippingAmount,
  TotalAmount,
  PaymentMethodAmount,
} from "@commercelayer/react-components"
import styled from "styled-components"
import tw from "twin.macro"

import { useTranslation } from "react-i18next"

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

        <LineItem>
          <LineItemWrapper>
            <LineItemImage width={80} />
            <div tw="pl-4 flex flex-col flex-1 justify-between">
              <LineItemName />
              <div tw="flex flex-row justify-between pb-1 text-sm">
                <LineItemQuantity>
                  {(props) => (
                    <p tw="text-gray-400">
                      {!!props.quantity &&
                        t("orderRecap.quantity", { count: props.quantity })}
                    </p>
                  )}
                </LineItemQuantity>
                <LineItemAmount />
              </div>
            </div>
          </LineItemWrapper>
          <hr tw="pb-3" />
        </LineItem>
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

const LineItemWrapper = styled.div`
  ${tw`flex flex-row mb-4`}
`
