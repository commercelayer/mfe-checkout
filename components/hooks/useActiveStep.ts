import { AppContext } from "components/data/AppProvider"
import { useState, useEffect, useContext } from "react"

interface UseActiveStep {
  activeStep: SingleStepEnum
  setActiveStep: (step: SingleStepEnum) => void
  lastActivableStep: SingleStepEnum
  isLoading: boolean
  steps: SingleStepEnum[]
}

export const useActiveStep = (): UseActiveStep => {
  const ctx = useContext(AppContext)
  const [activeStep, setActiveStep] = useState<SingleStepEnum>("Customer")
  const [isLoading, setIsLoading] = useState(true)
  const [lastActivableStep, setLastActivableStep] = useState<SingleStepEnum>(
    "Customer"
  )
  const [steps, setSteps] = useState<SingleStepEnum[]>([
    "Customer",
    "Shipping",
    "Payment",
  ])

  useEffect(() => {
    if (ctx) {
      setIsLoading(ctx.isLoading)

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
  }, [ctx])

  return {
    activeStep,
    lastActivableStep,
    setActiveStep,
    isLoading,
    steps,
  }
}
