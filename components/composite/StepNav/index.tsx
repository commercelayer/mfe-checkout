import { Fragment } from "react"
import styled, { css } from "styled-components"
import tw from "twin.macro"

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
    <div tw="flex flex-row mb-4">
      {(steps || []).map((step, index) => {
        const isActive = index === activeStep
        const isDisabled = index > lastActivable
        return (
          <Fragment key={index}>
            {index > 0 ? <div> / </div> : null}
            <Step
              onClick={() => {
                if (!isDisabled) {
                  onStepChange(index)
                }
              }}
              isActive={isActive}
              isDisabled={isDisabled}
            >
              {step}
            </Step>
          </Fragment>
        )
      })}
    </div>
  )
}

interface StepProps {
  isActive: boolean
  isDisabled: boolean
}

const Step = styled.div<StepProps>`
  ${tw`px-3`}
  ${({ isActive }) =>
    isActive
      ? css`
          ${tw`font-bold text-blue-500`}
        `
      : null}
  ${({ isDisabled }) =>
    isDisabled
      ? css`
          ${tw`text-gray-300 pointer-events-none`}
        `
      : null}
`
