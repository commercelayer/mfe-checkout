export interface DataLayerItemProps {
  item_id: NullableType<string>
  item_name: NullableType<string>
  price?: NullableType<number>
  currency: NullableType<string>
  quantity: NullableType<number>
}

export interface EcommerceProps {
  coupon?: NullableType<string>
  currency?: NullableType<string>
  shipping?: NullableType<number>
  items?: (DataLayerItemProps | undefined)[]
  value?: NullableType<number>
  shipping_tier?: NullableType<string>
  transaction_id?: NullableType<string>
  payment_type?: NullableType<string>
  tax?: NullableType<number>
}

export interface DataLayerProps {
  eventName:
    | "begin_checkout"
    | "add_shipping_info"
    | "add_payment_info"
    | "purchase"
  dataLayer: EcommerceProps
}
