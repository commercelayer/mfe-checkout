import {
  LineItemsContainer,
  LineItem,
  LineItemImage,
  LineItemName,
  LineItemQuantity,
  LineItemAmount,
  LineItemsCount,
  TaxesAmount,
  TotalAmount,
} from "@commercelayer/react-components"

import { useTranslation } from "components/data/i18n"

import "twin.macro"

export const OrderRecap: React.FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <LineItemsContainer>
        <h4 tw="text-lg mb-5 font-bold" data-cy="test-summary">
          <LineItemsCount>
            {(props) => t("orderRecap.cartContains", { count: props.quantity })}
          </LineItemsCount>
        </h4>
        <LineItem>
          <div tw="flex flex-row mb-4">
            <LineItemImage width={50} />
            <div tw="pl-4 flex-col flex-1">
              <LineItemName />
              <div tw="flex flex-row justify-between">
                <LineItemQuantity>
                  {(props) => (
                    <p tw="text-gray-400">
                      {!!props.quantity &&
                        t("orderRecap.quantity", { count: props.quantity })}
                    </p>
                  )}
                </LineItemQuantity>
                <div tw="font-bold">
                  <LineItemAmount className="text-red-500" />
                </div>
              </div>
            </div>
          </div>
          <hr tw="pb-3" />
        </LineItem>
      </LineItemsContainer>
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
