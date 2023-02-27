import styled from "styled-components"
import tw from "twin.macro"

import { CheckmarkIcon } from "./CheckmarkIcon"

interface Props {
  status: string
  stepNumber?: number
}

export const Badge: React.FC<Props> = ({ status, stepNumber }) => (
  <StepBadge
    data-testid="step-header-badge"
    active={status === "edit"}
    done={status === "done"}
    skip={status === "skip"}
  >
    {status === "done" || status === "skip" ? <CheckmarkIcon /> : stepNumber}
  </StepBadge>
)

interface BadgeProps {
  active: boolean
  done: boolean
  skip: boolean
}

const StepBadge = styled.div<BadgeProps>(({ active, done, skip }) => [
  tw`rounded-full text-contrast flex justify-center items-center w-6 h-6 text-xs font-bold`,
  active && tw`bg-primary`,
  (!active || skip) && tw`bg-gray-400/50`,
  done && tw`bg-green-400`,
])
