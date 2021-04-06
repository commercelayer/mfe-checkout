import {
  LineItem,
  LineItemImage,
  LineItemName,
  LineItemQuantity,
  LineItemAmount,
} from "@commercelayer/react-components"
import { LineItemType } from "@commercelayer/react-components/dist/typings"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import tw from "twin.macro"

interface Props {
  type: LineItemType
}

export const LineItemTypes: React.FC<Props> = ({ type }) => {
  const { t } = useTranslation()

  return (
    <LineItem type={type}>
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
  )
}

const LineItemWrapper = styled.div`
  ${tw`flex flex-row mb-4`}
`
