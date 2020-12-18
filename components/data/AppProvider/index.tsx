import { createContext, useState, useEffect } from "react"

interface AppProviderData {
  hasCustomer: boolean
  hasShipping: boolean
  onCustomerUpdated: () => void
  onShippingUpdated: () => void
}

export const AppContext = createContext<AppProviderData | null>(null)

export const AppProvider: React.FC = ({ children }) => {
  const [hasCustomer, setHasCustomer] = useState(false)
  const [hasShipping, setHasShipping] = useState(false)

  useEffect(() => {
    if (hasCustomer) {
      console.log("customer updated!")
    }
  }, [hasCustomer])

  useEffect(() => {
    if (hasShipping) {
      console.log("shipping updated!")
    }
  }, [hasShipping])

  return (
    <AppContext.Provider
      value={{
        hasCustomer,
        hasShipping,
        onCustomerUpdated: () => {
          setHasCustomer(true)
        },
        onShippingUpdated: () => {
          setHasShipping(true)
        },
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
