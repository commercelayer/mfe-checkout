import {
  LineItem,
  LineItemImage,
  LineItemName,
  LineItemAmount,
  LineItemOption,
  LineItemType,
  LineItemQuantity,
} from "@commercelayer/react-components"
import { useTranslation } from "next-i18next"
import React from "react"

import {
  LineItemDescription,
  LineItemQty,
  LineItemTitle,
  LineItemWrapper,
  StyledLineItemSkuCode,
  StyledLineItemOptions,
} from "./styled"

interface Props {
  type: LineItemType
}

const CODE_LOOKUP: { [k: string]: "sku_code" | "bundle_code" | undefined } = {
  skus: "sku_code",
  bundles: "bundle_code",
}

export const LineItemTypes: React.FC<Props> = ({ type }) => {
  const { t } = useTranslation()
  return (
    <LineItem type={type}>
      <LineItemWrapper data-test-id={`line-items-${type}`}>
        <LineItemImage
          width={85}
          className="self-start p-1 bg-white border rounded"
        />
        <LineItemDescription>
          <StyledLineItemSkuCode type={CODE_LOOKUP[type]} />
          <LineItemTitle>
            <LineItemName className="font-bold" />
            <LineItemAmount className="pl-2 text-lg font-extrabold" />
          </LineItemTitle>
          <StyledLineItemOptions showAll showName={true} className="options">
            <LineItemOption />
          </StyledLineItemOptions>
          <LineItemQty>
            <LineItemQuantity>
              {(props) =>
                !!props.quantity &&
                t("orderRecap.quantity", { count: props.quantity })
              }
            </LineItemQuantity>
          </LineItemQty>
        </LineItemDescription>
      </LineItemWrapper>
    </LineItem>
  )
}
