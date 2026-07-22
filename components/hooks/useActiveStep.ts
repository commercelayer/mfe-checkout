import { AppContext } from "components/data/AppProvider"
import { useContext, useEffect, useRef, useState } from "react"

interface UseActiveStep {
  activeStep: SingleStepEnum
  setActiveStep: (step: SingleStepEnum) => void
  lastActivableStep: SingleStepEnum
  isLoading: boolean
  steps: SingleStepEnum[]
}

const STEPS: SingleStepEnum[] = ["Customer", "Shipping", "Payment"]

export function checkIfCannotGoNext(
  step: SingleStepEnum,
  steps: SingleStepEnum[],
  lastActivableStep: SingleStepEnum,
) {
  if (lastActivableStep === "Complete") {
    return false
  }
  const indexCurrent = steps.indexOf(step)
  const indexLastActivable = steps.indexOf(lastActivableStep)
  return indexCurrent >= indexLastActivable
}

export const useActiveStep = (): UseActiveStep => {
  const [activeStep, setActiveStep] = useState<SingleStepEnum>("Customer")
  const [lastActivableStep, setLastActivableStep] =
    useState<SingleStepEnum>("Customer")
  const [steps, setSteps] = useState<SingleStepEnum[]>(STEPS)

  const ctx = useContext(AppContext)

  const isLoading = ctx?.isLoading ?? true
  const isFirstLoading = ctx?.isFirstLoading ?? true

  // A loading cycle that was already in flight when the user navigated must
  // not clobber their choice when it completes: keep track of when the last
  // cycle started and when the user last picked a step manually.
  const loadingStartedAtRef = useRef(0)
  const manualNavAtRef = useRef(0)

  useEffect(() => {
    if (isLoading) {
      loadingStartedAtRef.current = Date.now()
    }
  }, [isLoading])

  const setActiveStepManual = (step: SingleStepEnum) => {
    manualNavAtRef.current = Date.now()
    setActiveStep(step)
  }

  useEffect(() => {
    if (ctx && (isFirstLoading || !ctx.isLoading)) {
      // Alter steps of checkout
      if (ctx.isShipmentRequired) {
        setSteps(["Customer", "Shipping", "Payment"])
      } else {
        setSteps(["Customer", "Payment"])
      }

      const canSelectCustomerAddress =
        ((ctx.isShipmentRequired &&
          ctx.hasShippingAddress &&
          ctx.hasBillingAddress) ||
          (!ctx.isShipmentRequired && ctx.hasBillingAddress)) &&
        ctx.hasEmailAddress
      const canSelectShippingMethod =
        canSelectCustomerAddress &&
        (ctx.hasShippingAddress || !ctx.isShipmentRequired)
      const canSelectPayment =
        canSelectCustomerAddress &&
        canSelectShippingMethod &&
        ctx.hasShippingMethod
      const canPlaceOrder =
        canSelectCustomerAddress &&
        canSelectShippingMethod &&
        canSelectPayment &&
        ctx.hasPaymentMethod

      // If the user picked a step after this loading cycle started (e.g.
      // reopened an accordion while a background refetch was in flight),
      // their choice wins: update what is activable but don't move them.
      const keepManualSelection =
        manualNavAtRef.current > loadingStartedAtRef.current

      if (canPlaceOrder) {
        if (!keepManualSelection) setActiveStep("Complete")
        setLastActivableStep("Complete")
      } else if (canSelectPayment) {
        if (!keepManualSelection) setActiveStep("Payment")
        setLastActivableStep("Payment")
      } else if (canSelectShippingMethod) {
        if (!keepManualSelection) setActiveStep("Shipping")
        setLastActivableStep("Shipping")
      } else {
        if (!keepManualSelection) setActiveStep("Customer")
        setLastActivableStep("Customer")
      }
    }
  }, [isFirstLoading, isLoading])

  return {
    activeStep,
    lastActivableStep,
    setActiveStep: setActiveStepManual,
    isLoading,
    steps,
  }
}
