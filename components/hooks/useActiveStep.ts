import { useState, useEffect, useContext } from "react"

import { AppContext } from "components/data/AppProvider"

interface UseActiveStep {
  activeStep: SingleStepEnum
  setActiveStep: (step: SingleStepEnum) => void
  lastActivableStep: SingleStepEnum
  isLoading: boolean
  steps: SingleStepEnum[]
}

export const useActiveStep = (): UseActiveStep => {
  const [activeStep, setActiveStep] = useState<SingleStepEnum>("Customer")
  const [lastActivableStep, setLastActivableStep] = useState<SingleStepEnum>(
    "Customer"
  )
  const [steps] = useState<SingleStepEnum[]>([
    "Customer",
    "Shipping",
    "Payment",
  ])

  const ctx = useContext(AppContext)

  if (!ctx)
    return {
      activeStep,
      lastActivableStep,
      setActiveStep,
      isLoading: true,
      steps,
    }

  const { isFirstLoading, isLoading } = ctx

  useEffect(() => {
    if (ctx && (isFirstLoading || !ctx.isLoading)) {
      // Use it to alter steps of checkout
      // if (ctx.isShipmentRequired) {
      //   setSteps(['Customer', 'Shipping', 'Payment'])
      // } else {
      //   setSteps(['Customer', 'Payment'])
      // }

      const canSelectShippingMethod =
        ctx.hasShippingAddress || !ctx.isShipmentRequired
      const canSelectPayment = ctx.hasShippingAddress && ctx.hasShippingMethod
      const canPlaceOrder =
        ctx.hasShippingAddress && ctx.hasShippingMethod && ctx.hasPaymentMethod

      if (canPlaceOrder) {
        setActiveStep("Complete")
        setLastActivableStep("Complete")
      } else if (canSelectPayment) {
        setActiveStep("Payment")
        setLastActivableStep("Payment")
      } else if (canSelectShippingMethod) {
        setActiveStep("Shipping")
        setLastActivableStep("Shipping")
      } else {
        setActiveStep("Customer")
        setLastActivableStep("Customer")
      }
    }
  }, [isFirstLoading, isLoading])

  return {
    activeStep,
    lastActivableStep,
    setActiveStep,
    isLoading,
    steps,
  }
}
