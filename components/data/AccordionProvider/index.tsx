import { createContext, useState, useEffect, useContext } from "react"

import { AppContext } from "../AppProvider"

interface AccordionProviderData {
  isActive: boolean
  status: "edit" | "done" | "disabled"
  step: SingleStepEnum
  setStep: () => void
}

export const AccordionContext = createContext<AccordionProviderData | null>(
  null
)

interface AccordionProviderProps {
  step: SingleStepEnum
  activeStep: SingleStepEnum
  lastActivableStep: SingleStepEnum
  setActiveStep?: (step: SingleStepEnum) => void
}

export const AccordionProvider: React.FC<AccordionProviderProps> = ({
  children,
  step,
  activeStep,
  lastActivableStep,
  setActiveStep,
}) => {
  const ctx = useContext(AppContext)

  if (!ctx) {
    return <>{children}</>
  }

  const { isShipmentRequired, isPaymentRequired } = ctx

  const [isActive, setIsActive] = useState(false)
  const [status, setStatus] = useState<"done" | "edit" | "disabled">("disabled")

  const setStep = () => {
    setActiveStep && setActiveStep(step)
  }

  useEffect(() => {
    setIsActive(step === activeStep)
  }, [activeStep])

  useEffect(() => {
    if (isActive) {
      setStatus("edit")
      return
    }
    if (step === "Customer") {
      if (lastActivableStep === "Customer") {
        setStatus("disabled")
        return
      }
    }
    if (step === "Shipping") {
      if (
        lastActivableStep === "Customer" ||
        lastActivableStep === "Shipping" ||
        !isShipmentRequired
      ) {
        setStatus("disabled")
        return
      }
    }
    if (step === "Payment") {
      if (
        lastActivableStep === "Customer" ||
        lastActivableStep === "Shipping" ||
        lastActivableStep === "Payment" ||
        !isPaymentRequired
      ) {
        setStatus("disabled")
        return
      }
    }

    setStatus("done")
  }, [isActive, lastActivableStep])

  return (
    <AccordionContext.Provider
      value={{
        isActive,
        step,
        setStep,
        status,
      }}
    >
      {children}
    </AccordionContext.Provider>
  )
}
