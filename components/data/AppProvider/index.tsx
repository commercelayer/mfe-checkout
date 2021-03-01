import {
  AddressCollection,
  OrderCollection,
  ShipmentCollection,
} from "@commercelayer/js-sdk"
import { createContext, useState, useEffect } from "react"

import {
  fetchOrderById,
  FetchOrderByIdResponse,
  LineItemsDataLayerProps,
  ShipmentSelectedProps,
} from "./fetchOrderById"

import { fireGTM, GTMFireResponse } from "./fireGTM"

interface AppProviderData extends FetchOrderByIdResponse, GTMFireResponse {
  isLoading: boolean
  refetchOrder: () => Promise<void>
}

export const AppContext = createContext<AppProviderData | null>(null)

interface AppProviderProps {
  orderId?: string
  accessToken?: string
}

export const AppProvider: React.FC<AppProviderProps> = ({
  children,
  orderId,
  accessToken,
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)
  const [hasCustomerAddresses, setHasCustomerAddresses] = useState(false)
  const [isUsingNewBillingAddress, setIsUsingNewBillingAddress] = useState(true)
  const [isUsingNewShippingAddress, setIsUsingNewShippingAddress] = useState(
    true
  )
  const [hasSameAddresses, setHasSameAddresses] = useState(false)

  const [hasEmailAddress, setHasEmailAddress] = useState(false)
  const [emailAddress, setEmailAddress] = useState("")
  const [hasBillingAddress, setHasBillingAddress] = useState(false)
  const [
    billingAddress,
    setBillingAddress,
  ] = useState<AddressCollection | null>(null)
  const [hasShippingAddress, setHasShippingAddress] = useState(false)
  const [
    shippingAddress,
    setShippingAddress,
  ] = useState<AddressCollection | null>(null)
  const [hasShippingMethod, setHasShippingMethod] = useState(false)
  const [shipments, setShipments] = useState<ShipmentCollection[] | undefined>(
    []
  )
  const [shipmentsSelected, setShipmentsSelected] = useState<
    ShipmentSelectedProps[] | undefined
  >([])
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false)
  const [
    shippingCountryCodeLock,
    setShippingCountryCodeLock,
  ] = useState<string>("")
  const [lineItems, setLineItems] = useState<
    LineItemsDataLayerProps[] | undefined
  >([])
  const [order, setOrder] = useState<OrderCollection | undefined>(undefined)

  let GTM = fireGTM({
    lineItems,
    shipments,
    order,
  })

  const fetchOrderHandle = async (orderId?: string, accessToken?: string) => {
    if (!orderId || !accessToken) {
      return
    }
    setIsLoading(true)
    return await fetchOrderById({ orderId, accessToken }).then(
      ({
        isGuest,
        hasCustomerAddresses,
        isUsingNewBillingAddress,
        isUsingNewShippingAddress,
        hasSameAddresses,
        hasEmailAddress,
        emailAddress,
        hasBillingAddress,
        billingAddress,
        hasShippingAddress,
        shippingAddress,
        hasPaymentMethod,
        hasShippingMethod,
        shipments,
        shipmentsSelected,
        shippingCountryCodeLock,
        lineItems,
        order,
      }) => {
        setIsGuest(isGuest)
        setHasCustomerAddresses(hasCustomerAddresses)
        setHasSameAddresses(hasCustomerAddresses)
        setIsUsingNewBillingAddress(isUsingNewBillingAddress)
        setIsUsingNewShippingAddress(isUsingNewShippingAddress)
        setHasSameAddresses(hasSameAddresses)
        setHasEmailAddress(hasEmailAddress)
        setEmailAddress(emailAddress)
        setHasBillingAddress(hasBillingAddress)
        setBillingAddress(billingAddress)
        setHasShippingAddress(hasShippingAddress)
        setShippingAddress(shippingAddress)
        setHasShippingMethod(hasShippingMethod)
        setShipments(shipments)
        setShipmentsSelected(shipmentsSelected)
        setHasPaymentMethod(hasPaymentMethod)
        setIsLoading(false)
        setShippingCountryCodeLock(shippingCountryCodeLock)
        setLineItems(lineItems)
        setOrder(order)
        GTM = fireGTM({
          lineItems,
          shipments,
          order,
        })
        return
      }
    )
  }

  useEffect(() => {
    fetchOrderHandle(orderId, accessToken)
  }, [orderId, accessToken])

  return (
    <AppContext.Provider
      value={{
        isGuest,
        hasCustomerAddresses,
        isUsingNewBillingAddress,
        isUsingNewShippingAddress,
        hasSameAddresses,
        isLoading,
        hasEmailAddress,
        emailAddress,
        hasBillingAddress,
        billingAddress,
        hasShippingAddress,
        shippingAddress,
        hasShippingMethod,
        shipments,
        shipmentsSelected,
        hasPaymentMethod,
        shippingCountryCodeLock,
        lineItems,
        order,
        fireBeginCheckout: () => GTM.fireBeginCheckout(),
        fireAddShippingInfo: () => GTM.fireAddShippingInfo(),
        fireAddPaymentInfo: () => GTM.fireAddPaymentInfo(),
        firePurchase: () => GTM.firePurchase(),
        refetchOrder: async () => {
          return await fetchOrderHandle(orderId, accessToken)
        },
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
