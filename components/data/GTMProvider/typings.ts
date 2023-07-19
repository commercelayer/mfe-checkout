export interface DataLayerItemProps {
  item_id?: string
  item_name?: string
  price?: number
  currency?: string
  quantity?: number
}
export interface RakutenDataLayerItemProps {
  SKU?: string
  productName?: string
  unitPrice?: number
  unitPriceLessTax?: number
  quantity?: number
}

export interface EcommerceProps {
  coupon?: string
  currency?: string
  shipping?: number
  items?: (DataLayerItemProps | undefined)[]
  rakutenItems?: (DataLayerItemProps | undefined)[]
  value?: number
  shipping_tier?: string
  transaction_id?: number
  payment_type?: string
  tax?: number
  taxRate?: number // taxRate can be percentage or decimal
  taxRatePer?: number // taxRatePer will always be in percentage format
  market_id?: string
  customer_email?: string
}

export interface DataLayerProps {
  eventName:
    | "begin_checkout"
    | "add_shipping_info"
    | "add_payment_info"
    | "purchase"
  dataLayer: EcommerceProps
}
