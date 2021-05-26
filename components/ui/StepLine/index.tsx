import styled from "styled-components"
import tw from "twin.macro"

import { CheckmarkIcon } from "./CheckmarkIcon"

interface Props {
  status: "edit" | "done" | "disabled"
  stepNumber?: number
}

export const StepLine: React.FC<Props> = ({ status, stepNumber }) => {
  return (
    <Wrapper>
      <div>
        <Badge active={status === "edit"}>
          {status === "done" ? <CheckmarkIcon /> : stepNumber}
        </Badge>
      </div>
      <Line />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`flex flex-col items-center hidden md:visible md:-left-3 md:relative`}
`
interface BadgeProps {
  active: boolean
}

const Badge = styled.div<BadgeProps>(({ active }) => [
  tw`rounded-full text-contrast flex justify-center items-center w-6 h-6 text-xs font-bold`,
  active && tw`bg-primary`,
  !active && tw`bg-gray-400`,
])

const Line = styled.div`
  ${tw`w-px bg-gray-200 h-full hidden md:block`}
`
