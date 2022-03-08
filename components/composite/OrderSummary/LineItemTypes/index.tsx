import {
  LineItem,
  LineItemImage,
  LineItemName,
  LineItemQuantity,
  LineItemAmount,
  LineItemOptions,
  LineItemType,
} from "@commercelayer/react-components"
import { useTranslation } from "react-i18next"

import {
  LineItemDescription,
  LineItemQty,
  LineItemTitle,
  LineItemWrapper,
  StyledLineItemOption,
  StyledLineItemSkuCode,
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
          <LineItemOptions showAll showName={false}>
            <StyledLineItemOption />
          </LineItemOptions>
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
