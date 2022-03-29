import {
  LineItem,
  LineItemImage,
  LineItemName,
  LineItemAmount,
  LineItemOption,
  LineItemType,
} from "@commercelayer/react-components"
import React from "react"

import { QuantityWithPrice } from "./QuantityWithPrice"
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
  return (
    <LineItem type={type}>
      <LineItemWrapper>
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
            <QuantityWithPrice />
          </LineItemQty>
        </LineItemDescription>
      </LineItemWrapper>
    </LineItem>
  )
}
