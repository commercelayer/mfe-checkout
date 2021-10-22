import {
  LineItemsContainer,
  LineItemsCount,
  TaxesAmount,
  ShippingAmount,
  TotalAmount,
  PaymentMethodAmount,
  SubTotalAmount,
  DiscountAmount,
  GiftCardAmount,
} from "@commercelayer/react-components"
import { useTranslation } from "react-i18next"
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
} from "./styled"

export const OrderSummary: React.FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <LineItemsContainer>
        <SummaryHeader>
          <SummaryTitle data-cy="test-summary">
            {t("orderRecap.order_summary")}
          </SummaryTitle>
          <SummarySubTitle>
            <LineItemsCount>
              {(props) =>
                t("orderRecap.cartContains", { count: props.quantity })
              }
            </LineItemsCount>
          </SummarySubTitle>
        </SummaryHeader>
        <LineItemTypes type="skus" />
        <LineItemTypes type="gift_cards" />
      </LineItemsContainer>
      <TotalWrapper>
        <AmountSpacer />
        <AmountWrapper>
          <CouponOrGiftCard />
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
            <ShippingAmount>
              {(props) => {
                if (props.priceCents === 0) return <></>
                return (
                  <>
                    <RecapLineItem>
                      {t("orderRecap.shipping_amount")}
                    </RecapLineItem>
                    {props.price}
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
            <RecapLineItem>{t("orderRecap.tax_amount")}</RecapLineItem>
            <TaxesAmount />
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
    </>
  )
}
