export interface DataLayerItemProps {
  item_id?: string
  item_name?: string
  price?: number
  currency?: string
  quantity?: number
}

export interface EcommerceProps {
  coupon?: string
  currency?: string
  shipping?: number
  items?: (DataLayerItemProps | undefined)[]
  value?: number
  shipping_tier?: string
  transaction_id?: number
  payment_type?: string
  tax?: number
}

export interface DataLayerProps {
  eventName:
    | "begin_checkout"
    | "add_shipping_info"
    | "add_payment_info"
    | "purchase"
  dataLayer: EcommerceProps
}
