import styled from "styled-components"
import tw from "twin.macro"

import { CheckmarkIcon } from "./CheckmarkIcon"

interface Props {
  status: string
  stepNumber?: number
}

export const Badge: React.FC<Props> = ({ status, stepNumber }) => (
  <StepBadge
    data-cy="step-header-badge"
    active={status === "edit"}
    done={status === "done"}
  >
    {status === "done" || status === "skip" ? <CheckmarkIcon /> : stepNumber}
  </StepBadge>
)

interface BadgeProps {
  active: boolean
  done: boolean
}

const StepBadge = styled.div<BadgeProps>(({ active, done }) => [
  tw`rounded-full text-contrast flex justify-center items-center w-6 h-6 text-xs font-bold`,
  active && tw`bg-primary`,
  !active && tw`bg-gray-400`,
  done && tw`bg-green-400`,
])
