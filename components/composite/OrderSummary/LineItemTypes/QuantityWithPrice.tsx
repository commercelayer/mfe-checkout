import {
  LineItemQuantity,
  LineItemAmount,
} from "@commercelayer/react-components"
import React from "react"
import { useTranslation } from "react-i18next"

const LineItemQuantityWithPrice = () => {
  const { t } = useTranslation()
  return (
    <LineItemQuantity>
      {(props) => {
        if (props.quantity === 1) {
          return t("orderRecap.quantity", { count: props.quantity })
        }
        return (
          <LineItemAmount type="unit">
            {(propsPrice) =>
              t("orderRecap.quantity", {
                count: props.quantity,
                price: propsPrice.price,
              })
            }
          </LineItemAmount>
        )
      }}
    </LineItemQuantity>
  )
}

export const QuantityWithPrice = React.memo(LineItemQuantityWithPrice)
