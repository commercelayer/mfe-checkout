import styled from "styled-components"
import tw from "twin.macro"

import { CheckmarkIcon } from "./CheckmarkIcon"

interface Props {
  status: string
  stepNumber?: number
}

export const Badge: React.FC<Props> = ({ status, stepNumber }) => (
  <StepBadge active={status === "edit"}>
    {status === "done" ? <CheckmarkIcon /> : stepNumber}
  </StepBadge>
)

interface BadgeProps {
  active: boolean
}

const StepBadge = styled.div<BadgeProps>(({ active }) => [
  tw`rounded-full text-contrast flex justify-center items-center w-6 h-6 text-xs font-bold md:-left-3 md:relative`,
  active && tw`bg-primary`,
  !active && tw`bg-gray-400`,
])
