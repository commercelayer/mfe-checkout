import styled from "styled-components"
import tw from "twin.macro"

import { Step } from "./Step"

interface Props {
  steps: string[]
  onStepChange: (stepIndex: number) => void
  activeStep: number
  lastActivable: number
}

export const StepNav: React.FC<Props> = ({
  steps,
  onStepChange,
  activeStep,
  lastActivable,
}) => {
  return (
    <Wrapper>
      {(steps || []).map((step, index) => {
        const isActive = index === activeStep
        const isLocked = index > lastActivable
        return (
          <Step
            key={index}
            data-cy={`step_${step.toLocaleLowerCase()}`}
            onClick={() => {
              if (!isLocked) {
                onStepChange(index)
              }
            }}
            isActive={isActive}
            isLocked={isLocked}
          >
            {step}
          </Step>
        )
      })}

      <Step isLocked>Complete</Step>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`flex flex-row mb-12`}
`
