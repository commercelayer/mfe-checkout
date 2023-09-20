export interface DataLayerItemProps {
  item_id: NullableType<string>
  item_name: NullableType<string>
  price?: NullableType<number>
  currency: NullableType<string>
  quantity: NullableType<number>
  item_group_id?: NullableType<string>
}
export interface RakutenDataLayerItemProps {
  SKU: NullableType<string>
  productName: NullableType<string>
  unitPrice: NullableType<number>
  unitPriceLessTax: NullableType<number>
  quantity: NullableType<number>
}

export interface EcommerceProps {
  coupon?: NullableType<string>
  currency?: NullableType<string>
  shipping?: NullableType<number>
  items?: (DataLayerItemProps | undefined)[]
  rakutenItems?: (RakutenDataLayerItemProps | undefined)[]
  value?: NullableType<number>
  shipping_tier?: NullableType<string>
  transaction_id?: NullableType<number>
  payment_type?: NullableType<string>
  tax?: NullableType<number>
  taxRate?: NullableType<number> // taxRate can be percentage or decimal
  taxRatePer?: NullableType<number> // taxRatePer will always be in percentage format
  market_id?: NullableType<string>
  customer_email?: NullableType<string>
}

export interface DataLayerProps {
  eventName:
    | "begin_checkout"
    | "add_shipping_info"
    | "add_payment_info"
    | "purchase"
  dataLayer: EcommerceProps
}
