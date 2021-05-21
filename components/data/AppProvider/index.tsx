import { createContext, useState, useEffect } from "react"

import { fetchOrderById, FetchOrderByIdResponse } from "./fetchOrderById"

interface AppProviderData extends FetchOrderByIdResponse {
  isLoading: boolean
  orderId: string
  accessToken: string
  endpoint: string
  isFirstLoading: boolean
  refetchOrder: () => Promise<void>
}

interface AppStateData extends FetchOrderByIdResponse {
  isLoading: boolean
  isFirstLoading: boolean
}

const initialState: AppStateData = {
  isLoading: true,
  isFirstLoading: true,
  isGuest: false,
  hasCustomerAddresses: false,
  isUsingNewBillingAddress: true,
  isUsingNewShippingAddress: true,
  hasSameAddresses: false,
  hasEmailAddress: false,
  emailAddress: "",
  hasBillingAddress: false,
  billingAddress: null,
  isShipmentRequired: true,
  shippingAddress: null,
  hasShippingMethod: false,
  hasShippingAddress: false,
  shipments: [],
  paymentMethod: null,
  hasPaymentMethod: false,
  isPaymentRequired: true,
  shippingCountryCodeLock: "",
  isComplete: false,
  returnUrl: "",
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
  const [state, setState] = useState(initialState)

  const fetchOrderHandle = async (orderId?: string, accessToken?: string) => {
    if (!orderId || !accessToken) {
      return
    }
    setState({ ...state, isLoading: true })

    return await fetchOrderById({ orderId, accessToken, endpoint }).then(
      (newState) => {
        setState({ ...newState, isLoading: false, isFirstLoading: false })
      }
    )
  }

  useEffect(() => {
    const unsubscribe = () => {
      fetchOrderHandle(orderId, accessToken)
    }
    return unsubscribe()
  }, [orderId, accessToken])

  return (
    <AppContext.Provider
      value={{
        ...state,
        orderId,
        accessToken,
        endpoint,
        refetchOrder: async () => {
          return await fetchOrderHandle(orderId, accessToken)
        },
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
