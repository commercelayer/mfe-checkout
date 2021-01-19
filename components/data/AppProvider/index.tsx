import { createContext, useState, useEffect } from "react"

import { fetchOrderById } from "./fetchOrderById"

interface AppProviderData {
  isGuest: boolean
  hasEmailAddress: boolean
  emailAddress: string
  hasBillingAddress: boolean
  billingAddress: any
  hasShippingAddress: boolean
  shippingAddress: any
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
  const [isGuest, setIsGuest] = useState(false)
  const [hasEmailAddress, setHasEmailAddress] = useState(false)
  const [emailAddress, setEmailAddress] = useState("")
  const [hasBillingAddress, setHasBillingAddress] = useState(false)
  const [billingAddress, setBillingAddress] = useState({})
  const [hasShippingAddress, setHasShippingAddress] = useState(false)
  const [shippingAddress, setShippingAddress] = useState({})
  const [hasShippingMethod, setHasShippingMethod] = useState(false)
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false)

  const fetchOrderHandle = (orderId?: string, accessToken?: string) => {
    if (!orderId || !accessToken) {
      return
    }
    setIsLoading(true)
    fetchOrderById({ orderId, accessToken }).then(
      ({
        isGuest,
        hasEmailAddress,
        emailAddress,
        hasBillingAddress,
        billingAddress,
        hasShippingAddress,
        shippingAddress,
        hasPaymentMethod,
        hasShippingMethod,
      }) => {
        setIsGuest(isGuest)
        setHasEmailAddress(hasEmailAddress)
        setEmailAddress(emailAddress)
        setHasBillingAddress(hasBillingAddress)
        setBillingAddress(billingAddress)
        setHasShippingAddress(hasShippingAddress)
        setShippingAddress(shippingAddress)
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
        isGuest,
        isLoading,
        hasEmailAddress,
        emailAddress,
        hasBillingAddress,
        billingAddress,
        hasShippingAddress,
        shippingAddress,
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
