import {
  LineItem,
  LineItemAmount,
  LineItemField,
  LineItemImage,
  LineItemName,
  LineItemOption,
  LineItemQuantity,
  type TLineItem,
} from "@commercelayer/react-components"
import { CronExpressionParser } from "cron-parser"
import cronstrue from "cronstrue"
import type React from "react"
import { useTranslation } from "react-i18next"
import "cronstrue/locales/en"
import "cronstrue/locales/it"
import "cronstrue/locales/de"

import { FlexContainer } from "components/ui/FlexContainer"
import { RepeatIcon } from "../RepeatIcon"

import {
  LineItemDescription,
  LineItemFrequency,
  LineItemQty,
  LineItemTitle,
  LineItemWrapper,
  StyledLineItemOptions,
  StyledLineItemSkuCode,
} from "./styled"

interface Props {
  type: TLineItem
  hideItemCodes?: NullableType<boolean>
}

const CODE_LOOKUP: { [k: string]: "sku_code" | "bundle_code" | undefined } = {
  skus: "sku_code",
  bundles: "bundle_code",
}

export const LineItemTypes: React.FC<Props> = ({ type, hideItemCodes }) => {
  const { t, i18n } = useTranslation()
  return (
    <LineItem type={type}>
      <LineItemWrapper data-testid={`line-items-${type}`}>
        <LineItemImage
          width={85}
          className="self-start p-1 bg-white border rounded-sm"
        />
        <LineItemDescription>
          {!hideItemCodes && <StyledLineItemSkuCode type={CODE_LOOKUP[type]} />}
          <LineItemTitle>
            <LineItemName className="font-bold" />
            <LineItemAmount
              data-testid="line-item-amount"
              className="pl-2 text-lg font-extrabold"
            />
          </LineItemTitle>
          <StyledLineItemOptions showAll showName={true} className="options">
            <LineItemOption />
          </StyledLineItemOptions>
          <FlexContainer className="flex-col justify-between mt-2 lg:flex-row">
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
            <LineItemField attribute="frequency">
              {/*  @ts-expect-error typing on attribute */}
              {({ attributeValue }) => {
                if (!attributeValue) {
                  return null
                }
                let isCronValid = true
                try {
                  CronExpressionParser.parse(attributeValue as string)
                } catch (_e) {
                  isCronValid = false
                }
                const frequency = isCronValid
                  ? cronstrue.toString(attributeValue as string, {
                      locale: i18n.language,
                    })
                  : t(`orderRecap.frequency.${attributeValue}`)

                return (
                  <LineItemFrequency data-testid="line-items-frequency">
                    <RepeatIcon />
                    {frequency}
                  </LineItemFrequency>
                )
              }}
            </LineItemField>
          </FlexContainer>
        </LineItemDescription>
      </LineItemWrapper>
    </LineItem>
  )
}
