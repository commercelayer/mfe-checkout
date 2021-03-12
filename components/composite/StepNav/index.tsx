import { useTranslation } from "components/data/i18n"
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
  const { t } = useTranslation()

  return (
    <Wrapper>
      {(steps || []).map((step, index) => {
        const isActive = index === activeStep
        const isLocked = index > lastActivable
        return (
          <Step
            key={index}
            data-cy={`step_${step.toLocaleLowerCase()}`}
            data-status={isActive}
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

      <Step isLocked={activeStep != 3} isActive={activeStep == 3}>
        {t("general.complete")}
      </Step>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`flex flex-row mb-12`}
`
