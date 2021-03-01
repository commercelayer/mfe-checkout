import { useState, useEffect, useContext } from "react"

import { AppContext } from "components/data/AppProvider"

interface UseActiveStep {
  activeStep: number
  setActiveStep: (step: number) => void
  lastActivableStep: number
  isLoading: boolean
}

export const useActiveStep = (): UseActiveStep => {
  const ctx = useContext(AppContext)
  const [activeStep, setActiveStep] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [lastActivableStep, setLastActivableStep] = useState(0)
  const [beginCheckout, setBeginCheckout] = useState(true)

  useEffect(() => {
    if (ctx) {
      setIsLoading(ctx.isLoading)

      if (
        beginCheckout &&
        ctx?.lineItems &&
        ctx.lineItems.length > 0 &&
        ctx.fireBeginCheckout &&
        ctx.order
      ) {
        ctx.fireBeginCheckout()
        setBeginCheckout(false)
      }

      // const canSelectShippingAddress = ctx.hasEmailAddress
      const canSelectShippingMethod = ctx.hasShippingAddress
      const canSelectPayment = ctx.hasShippingAddress && ctx.hasShippingMethod
      const canPlaceOrder =
        ctx.hasShippingAddress && ctx.hasShippingMethod && ctx.hasPaymentMethod

      if (canPlaceOrder) {
        setActiveStep(2)
        setLastActivableStep(2)
      } else if (canSelectPayment) {
        setActiveStep(2)
        setLastActivableStep(2)
      } else if (canSelectShippingMethod) {
        setActiveStep(1)
        setLastActivableStep(1)
      } else {
        setActiveStep(0)
        setLastActivableStep(0)
      }
    }
  }, [ctx])

  return {
    activeStep,
    lastActivableStep,
    setActiveStep,
    isLoading,
  }
}
