import { LineItemCode, LineItemField } from "@commercelayer/react-components"
import {
  LineItem,
  TLineItem,
} from "@commercelayer/react-components/line_items/LineItem"
import LineItemAmount from "@commercelayer/react-components/line_items/LineItemAmount"
import LineItemImage from "@commercelayer/react-components/line_items/LineItemImage"
import LineItemName from "@commercelayer/react-components/line_items/LineItemName"
import LineItemOption from "@commercelayer/react-components/line_items/LineItemOption"
import LineItemQuantity from "@commercelayer/react-components/line_items/LineItemQuantity"
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
  type: TLineItem
}

const CODE_LOOKUP: { [k: string]: "sku_code" | "bundle_code" | undefined } = {
  skus: "sku_code",
  bundles: "bundle_code",
}

export const LineItemTypes: React.FC<Props> = ({ type }) => {
  const { t } = useTranslation()
  return (
    <LineItem type={type}>
      <div key={1}>
        <div className="ml-5 mr-5">{/* <ErrorContainer /> */}</div>
        <div className="p-5">
          <div className="flex space-x-5">
            <div>
              <div className="card-image-container">
                <LineItemImage />
              </div>
            </div>
            <div className="w-full">
              <div className="flex">
                <div className="w-full">
                  <div>
                    <p className="box-border border-0 border-solid border-gray-200 text-sm  not-italic leading-5 text-[rgba(77,77,77,1)]">
                      {/* <LineItemName /> */}
                      <LineItemField attribute="metadata" tagElement="div">
                        {({ attributeValue }: any) => {
                          return (
                            <div className="flex-col">
                              {attributeValue?.brandName && (
                                <div className="font-normal text-sm leading-5 text-gray-400">
                                  {attributeValue?.brandName}
                                </div>
                              )}
                              {attributeValue?.skuDisplayName && (
                                <div className="font-semibold text-md leading-5 text-gray-700 opacity-80">
                                  {attributeValue?.skuDisplayName}
                                </div>
                              )}
                              {attributeValue?.color && (
                                <div>
                                  <div className="flex gap-1 text-sm">
                                    <div className="font-semibold text-md leading-5 text-gray-700 opacity-80">
                                      {attributeValue?.color}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {attributeValue?.frame_size && (
                                <div>
                                  <div className="flex gap-1 text-sm">
                                    <div className="font-semibold text-md leading-5 text-gray-700 opacity-80">
                                      {attributeValue?.frame_size}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        }}
                      </LineItemField>
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4">
                <div className="font-normal text-xxs leading-5 text-gray-700">
                  <span>{"Qty:"}</span>{" "}
                  <span>
                    <LineItemQuantity>
                      {({ quantity }) => {
                        if (quantity !== undefined) {
                          return <span>{quantity}</span>
                        }
                        return null
                      }}
                    </LineItemQuantity>
                  </span>
                </div>
                <div className="font-semibold text-xxs leading-5 text-gray-700">
                  <LineItemAmount />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="h-px my-2 mb-5 bg-gray-200 border-0 dark:bg-gray-700"></hr>
      {/* <LineItemWrapper data-testid={`line-items-${type}`}>
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
              {(props) => (
                <>
                  {!!props.quantity &&
                    t("orderRecap.quantity", { count: props.quantity })}
                </>
              )}
            </LineItemQuantity>
          </LineItemQty>
        </LineItemDescription>
      </LineItemWrapper> */}
    </LineItem>
  )
}
