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
import { LINE_ITEMS_SHOPPABLE } from "components/utils/constants"

import { CouponOrGiftCard } from "./CouponOrGiftCard"
import { LineItemTypes } from "./LineItemTypes"
import { ReturnToCart } from "./ReturnToCart"
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

  const isTaxCalculated = appCtx.isShipmentRequired
    ? appCtx.hasBillingAddress &&
      appCtx.hasShippingAddress &&
      appCtx.hasShippingMethod
    : appCtx.hasBillingAddress
  return (
    <Wrapper data-test-id="order-summary">
      <LineItemsContainer>
        {!readonly && (
          <SummaryHeader>
            <SummaryTitle data-test-id="test-summary">
              {t("orderRecap.order_summary")}
            </SummaryTitle>
            <SummarySubTitle>
              <LineItemsCount
                data-test-id="items-count"
                typeAccepted={LINE_ITEMS_SHOPPABLE}
              >
                {(props) => (
                  <span data-test-id="items-count">
                    {t("orderRecap.cartContains", { count: props.quantity })}
                  </span>
                )}
              </LineItemsCount>
            </SummarySubTitle>
          </SummaryHeader>
        )}
        {LINE_ITEMS_SHOPPABLE.map((type) => (
          <LineItemTypes type={type} key={type} />
        ))}
      </LineItemsContainer>
      <TotalWrapper>
        <AmountSpacer />
        <AmountWrapper>
          <CouponOrGiftCard
            readonly={readonly}
            setCouponOrGiftCard={appCtx.setCouponOrGiftCard}
          />
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
                    <div data-test-id="discount-amount">{props.price}</div>
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
                    <div data-test-id="adjustment-amount">{props.price}</div>
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
                    <div data-test-id="shipping-amount">
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
          <RecapLine data-test-id="payment-method-amount">
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
                return (
                  <>
                    <RecapLineItem>
                      <Trans
                        i18nKey={
                          isTaxCalculated && appCtx.taxIncluded
                            ? "orderRecap.tax_included_amount"
                            : "orderRecap.tax_amount"
                        }
                        components={
                          isTaxCalculated
                            ? {
                                style: (
                                  <span
                                    className={
                                      appCtx.taxIncluded
                                        ? "text-gray-500 font-normal"
                                        : ""
                                    }
                                  />
                                ),
                              }
                            : {}
                        }
                      />
                    </RecapLineItem>
                    <div data-test-id="tax-amount">
                      {isTaxCalculated ? props.price : t("orderRecap.notSet")}
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
                    <div data-test-id="giftcard-amount">{props.price}</div>
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
              data-test-id="total-amount"
              className="text-xl font-extrabold"
            />
          </RecapLineTotal>
          <ReturnToCart cartUrl={appCtx.cartUrl} />
        </AmountWrapper>
      </TotalWrapper>
    </Wrapper>
  )
}
