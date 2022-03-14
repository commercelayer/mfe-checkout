export interface DataLayerItemProps {
  item_id: string | undefined
  item_name: string | undefined
  price: number | undefined
  currency: string | undefined
  quantity: number | undefined
}

export interface EcommerceProps {
  coupon?: string
  currency: string | undefined
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
