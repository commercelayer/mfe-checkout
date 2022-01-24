import {
  LineItemsContainer,
  LineItemsCount,
  TaxesAmount,
  ShippingAmount,
  TotalAmount,
  PaymentMethodAmount,
  SubTotalAmount,
  DiscountAmount,
  AdjustmentAmount,
  GiftCardAmount,
} from "@commercelayer/react-components"
import { Trans, useTranslation } from "react-i18next"

import { AppProviderData } from "components/data/AppProvider"
import "twin.macro"

import { CouponOrGiftCard } from "./CouponOrGiftCard"
import { LineItemTypes } from "./LineItemTypes"
import {
  SummaryHeader,
  SummarySubTitle,
  SummaryTitle,
  AmountWrapper,
  TotalWrapper,
  AmountSpacer,
  RecapLine,
  RecapLineTotal,
  RecapLineItemTotal,
  RecapLineItem,
  Wrapper,
} from "./styled"

interface Props {
  appCtx: AppProviderData
  readonly?: boolean
}

export const OrderSummary: React.FC<Props> = ({ appCtx, readonly }) => {
  const { t } = useTranslation()

  return (
    <Wrapper data-cy="order-summary">
      <LineItemsContainer>
        {!readonly && (
          <SummaryHeader>
            <SummaryTitle data-cy="test-summary">
              {t("orderRecap.order_summary")}
            </SummaryTitle>
            <SummarySubTitle>
              <LineItemsCount
                data-cy="items-count"
                typeAccepted={["skus", "gift_cards", "bundles"]}
              >
                {(props) => (
                  <span data-cy="items-count">
                    {t("orderRecap.cartContains", { count: props.quantity })}
                  </span>
                )}
              </LineItemsCount>
            </SummarySubTitle>
          </SummaryHeader>
        )}
        <LineItemTypes type="skus" />
        <LineItemTypes type="bundles" />
        <LineItemTypes type="gift_cards" />
      </LineItemsContainer>
      <TotalWrapper>
        <AmountSpacer />
        <AmountWrapper>
          <CouponOrGiftCard readonly={readonly} />
          <RecapLine>
            <RecapLineItem>{t("orderRecap.subtotal_amount")}</RecapLineItem>
            <SubTotalAmount />
          </RecapLine>
          <RecapLine>
            <DiscountAmount>
              {(props) => {
                if (props.priceCents === 0) return <></>
                return (
                  <>
                    <RecapLineItem>
                      {t("orderRecap.discount_amount")}
                    </RecapLineItem>
                    <div data-cy="discount-amount">{props.price}</div>
                  </>
                )
              }}
            </DiscountAmount>
          </RecapLine>
          <RecapLine>
            <AdjustmentAmount>
              {(props) => {
                if (props.priceCents === 0) return <></>
                return (
                  <>
                    <RecapLineItem>
                      {t("orderRecap.adjustment_amount")}
                    </RecapLineItem>
                    <div data-cy="adjustment-amount">{props.price}</div>
                  </>
                )
              }}
            </AdjustmentAmount>
          </RecapLine>
          <RecapLine>
            <ShippingAmount>
              {(props) => {
                if (!appCtx.isShipmentRequired) return <></>
                return (
                  <>
                    <RecapLineItem>
                      {t("orderRecap.shipping_amount")}
                    </RecapLineItem>
                    <div data-cy="shipping-amount">
                      {!appCtx.hasShippingMethod
                        ? t("orderRecap.notSet")
                        : props.priceCents === 0
                        ? t("general.free")
                        : props.price}
                    </div>
                  </>
                )
              }}
            </ShippingAmount>
          </RecapLine>
          <RecapLine data-cy="payment-method-amount">
            <PaymentMethodAmount>
              {(props) => {
                if (props.priceCents === 0) return <></>
                return (
                  <>
                    <RecapLineItem>
                      {t("orderRecap.payment_method_amount")}
                    </RecapLineItem>
                    {props.price}
                  </>
                )
              }}
            </PaymentMethodAmount>
          </RecapLine>
          <RecapLine>
            <TaxesAmount>
              {(props) => {
                const isTaxIncluded =
                  appCtx.hasShippingAddress && appCtx.hasShippingMethod
                return (
                  <>
                    <RecapLineItem>
                      <Trans
                        i18nKey={
                          isTaxIncluded
                            ? "orderRecap.tax_included_amount"
                            : "orderRecap.tax_amount"
                        }
                        components={
                          isTaxIncluded
                            ? {
                                style: (
                                  <span
                                    className={
                                      !appCtx.taxIncluded
                                        ? "text-gray-600 font-normal"
                                        : ""
                                    }
                                  />
                                ),
                              }
                            : {}
                        }
                      />
                    </RecapLineItem>
                    <div data-cy="tax-amount">
                      {appCtx.hasShippingAddress && appCtx.hasShippingMethod
                        ? props.price
                        : t("orderRecap.notSet")}
                    </div>
                  </>
                )
              }}
            </TaxesAmount>
          </RecapLine>
          <RecapLine>
            <GiftCardAmount>
              {(props) => {
                if (props.priceCents === 0) return <></>
                return (
                  <>
                    <RecapLineItem>
                      {t("orderRecap.giftcard_amount")}
                    </RecapLineItem>
                    <div data-cy="giftcard-amount">{props.price}</div>
                  </>
                )
              }}
            </GiftCardAmount>
          </RecapLine>
          <RecapLineTotal>
            <RecapLineItemTotal>
              {t("orderRecap.total_amount")}
            </RecapLineItemTotal>
            <TotalAmount
              data-cy="total-amount"
              className="text-xl font-extrabold"
            />
          </RecapLineTotal>
        </AmountWrapper>
      </TotalWrapper>
    </Wrapper>
  )
}
