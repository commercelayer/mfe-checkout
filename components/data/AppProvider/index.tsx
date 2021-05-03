import {
  AddressCollection,
  PaymentMethodCollection,
} from "@commercelayer/js-sdk"
import { createContext, useState, useEffect } from "react"

import { fetchOrderById, FetchOrderByIdResponse } from "./fetchOrderById"

interface AppProviderData extends FetchOrderByIdResponse {
  isLoading: boolean
  orderId: string
  accessToken: string
  endpoint: string
  refetchOrder: () => Promise<void>
}

export const AppContext = createContext<AppProviderData | null>(null)

interface AppProviderProps {
  endpoint: string
  orderId: string
  accessToken: string
}

export const AppProvider: React.FC<AppProviderProps> = ({
  children,
  orderId,
  accessToken,
  endpoint,
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
  const [isShipmentRequired, setIsShipmentRequired] = useState(true)
  const [hasShippingAddress, setHasShippingAddress] = useState(false)
  const [
    shippingAddress,
    setShippingAddress,
  ] = useState<AddressCollection | null>(null)
  const [hasShippingMethod, setHasShippingMethod] = useState(false)
  const [shipments, setShipments] = useState<ShipmentSelected[]>([])
  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState<PaymentMethodCollection | null>(null)
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false)
  const [isPaymentRequired, setIsPaymentRequired] = useState(true)
  const [
    shippingCountryCodeLock,
    setShippingCountryCodeLock,
  ] = useState<string>("")

  const [isComplete, setIsComplete] = useState(false)

  const [returnUrl, setReturnUrl] = useState("")

  const fetchOrderHandle = async (orderId?: string, accessToken?: string) => {
    if (!orderId || !accessToken) {
      return
    }
    setIsLoading(true)
    return await fetchOrderById({ orderId, accessToken, endpoint }).then(
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
        paymentMethod,
        hasPaymentMethod,
        hasShippingMethod,
        shipments,
        isShipmentRequired,
        isPaymentRequired,
        shippingCountryCodeLock,
        isComplete,
        returnUrl,
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
        setPaymentMethod(paymentMethod)
        setHasPaymentMethod(hasPaymentMethod)
        setIsShipmentRequired(isShipmentRequired)
        setIsPaymentRequired(isPaymentRequired)
        setShippingCountryCodeLock(shippingCountryCodeLock)
        setIsComplete(isComplete)
        setIsLoading(false)
        setReturnUrl(returnUrl)
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
        paymentMethod,
        hasPaymentMethod,
        shippingCountryCodeLock,
        isShipmentRequired,
        isPaymentRequired,
        isComplete,
        orderId,
        accessToken,
        endpoint,
        returnUrl,
        refetchOrder: async () => {
          return await fetchOrderHandle(orderId, accessToken)
        },
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
