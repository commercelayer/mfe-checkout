import { createContext, useState, useEffect } from "react"

import { checkIfCannotGoNext } from "components/hooks/useActiveStep"

interface AccordionProviderData {
  isActive: boolean
  cannotGoNext: boolean
  status: "edit" | "done" | "disabled" | "skip"
  step: SingleStepEnum
  setStep: () => void
  closeStep: () => void
}

export const AccordionContext = createContext<AccordionProviderData | null>(
  null
)

interface AccordionProviderProps {
  step: SingleStepEnum
  activeStep: SingleStepEnum
  lastActivableStep: SingleStepEnum
  setActiveStep?: (step: SingleStepEnum) => void
  isStepRequired?: boolean
  isStepDone?: boolean
}

export const AccordionProvider: React.FC<AccordionProviderProps> = ({
  children,
  step,
  activeStep,
  lastActivableStep,
  setActiveStep,
  isStepRequired = true,
  isStepDone = false,
}) => {
  const [isActive, setIsActive] = useState(false)
  // state to disable pointer on open accordion if cannot progress
  const [cannotGoNext, setCannotGoNext] = useState(true)
  const [status, setStatus] = useState<"done" | "edit" | "disabled" | "skip">(
    "disabled"
  )

  const setStep = () => {
    setActiveStep && setActiveStep(step)
  }

  const closeStep = () => setActiveStep && setActiveStep(lastActivableStep)

  useEffect(() => {
    setIsActive(step === activeStep)
  }, [activeStep])

  useEffect(() => {
    return setCannotGoNext(checkIfCannotGoNext(step, lastActivableStep))
  }, [step, lastActivableStep])

  useEffect(() => {
    if (!isStepRequired && checkIfCannotGoNext(step, lastActivableStep)) {
      setStatus("skip")
      return
    }

    if (isActive) {
      setStatus("edit")
      return
    }

    if (isStepDone) {
      setStatus("done")
      return
    }

    if (checkIfCannotGoNext(step, lastActivableStep)) {
      setStatus("disabled")
      return
    }

    setStatus("done")
  }, [isActive, step, lastActivableStep])

  return (
    <AccordionContext.Provider
      value={{
        isActive,
        cannotGoNext,
        step,
        setStep,
        closeStep,
        status,
      }}
    >
      {children}
    </AccordionContext.Provider>
  )
}
