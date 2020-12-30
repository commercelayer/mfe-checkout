import {
  LineItemsContainer,
  LineItem,
  LineItemImage,
  LineItemName,
  LineItemQuantity,
  LineItemAmount,
  LineItemsCount,
} from "@commercelayer/react-components"

import { useTranslation } from "../../../i18n"

import "twin.macro"

export const OrderRecap: React.FC = () => {
  const { t } = useTranslation()

  return (
    <LineItemsContainer>
      <LineItemsCount>
        {(props) => (
          <h4 tw="text-lg mb-5 font-bold" data-cy="test-summary">
            {t("orderRecap.cartContains", { value: props.quantity })}
          </h4>
        )}
      </LineItemsCount>
      <LineItem>
        <div tw="flex flex-row mb-4">
          <LineItemImage width={50} />
          <div tw="pl-4">
            <LineItemName />
            <div tw="flex flex-row justify-between">
              <LineItemQuantity>
                {(props) => (
                  <p tw="text-gray-400">
                    {t("orderRecap.quantity", { value: props.quantity })}
                  </p>
                )}
              </LineItemQuantity>
              <div tw="font-bold">
                <LineItemAmount className="text-red-500" />
              </div>
            </div>
          </div>
        </div>
      </LineItem>
    </LineItemsContainer>
  )
}
