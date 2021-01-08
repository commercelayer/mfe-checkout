import { createContext, useState, useEffect } from "react"

import { fetchOrderById } from "./fetchOrderById"

interface AppProviderData {
  hasEmailAddress: boolean
  hasBillingAddress: boolean
  hasShippingAddress: boolean
  hasShippingMethod: boolean
  hasPaymentMethod: boolean
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
  const [hasEmailAddress, setHasEmailAddress] = useState(false)
  const [hasBillingAddress, setHasBillingAddress] = useState(false)
  const [hasShippingAddress, setHasShippingAddress] = useState(false)
  const [hasShippingMethod, setHasShippingMethod] = useState(false)
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false)

  const fetchOrderHandle = (orderId?: string, accessToken?: string) => {
    if (!orderId || !accessToken) {
      return
    }
    setIsLoading(true)
    fetchOrderById({ orderId, accessToken }).then(
      ({
        hasEmailAddress,
        hasBillingAddress,
        hasShippingAddress,
        hasPaymentMethod,
        hasShippingMethod,
      }) => {
        setHasEmailAddress(hasEmailAddress)
        setHasBillingAddress(hasBillingAddress)
        setHasShippingAddress(hasShippingAddress)
        setHasShippingMethod(hasShippingMethod)
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
        isLoading,
        hasEmailAddress,
        hasBillingAddress,
        hasShippingAddress,
        hasShippingMethod,
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
