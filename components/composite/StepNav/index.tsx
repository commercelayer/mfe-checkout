import { useTranslation } from "react-i18next"
import styled from "styled-components"
import tw from "twin.macro"

import { Step } from "./Step"

interface Props {
  steps: Array<SingleStepEnum>
  onStepChange: (stepIndex: SingleStepEnum) => void
  activeStep: SingleStepEnum
  lastActivable: SingleStepEnum
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
        const isActive = step === activeStep
        const isLocked =
          steps.indexOf(step) > steps.indexOf(lastActivable) &&
          lastActivable !== "Complete"
        return (
          <Step
            key={index}
            data-cy={`step_${step.toLocaleLowerCase()}`}
            data-status={isActive}
            onClick={() => {
              if (!isLocked) {
                onStepChange(step)
              }
            }}
            isActive={isActive}
            isLocked={isLocked}
          >
            {t(`step${step}.title`)}
          </Step>
        )
      })}

      <Step
        isLocked={activeStep !== "Complete"}
        isActive={activeStep === "Complete"}
      >
        {t("general.complete")}
      </Step>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`flex flex-row mb-12`}
`
