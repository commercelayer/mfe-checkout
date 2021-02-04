import { AddressCollection, ShipmentCollection } from "@commercelayer/js-sdk"
import { createContext, useState, useEffect } from "react"

import { fetchOrderById, FetchOrderByIdResponse } from "./fetchOrderById"

interface AppProviderData extends FetchOrderByIdResponse {
  isLoading: boolean
  refetchOrder: () => void
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
  const [shipments, setShipments] = useState<ShipmentCollection[]>([])
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false)

  const fetchOrderHandle = (orderId?: string, accessToken?: string) => {
    if (!orderId || !accessToken) {
      return
    }
    setIsLoading(true)
    fetchOrderById({ orderId, accessToken }).then(
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
        setHasPaymentMethod(hasPaymentMethod)
        setIsLoading(false)
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
        hasPaymentMethod,
        refetchOrder: () => {
          fetchOrderHandle(orderId, accessToken)
        },
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
