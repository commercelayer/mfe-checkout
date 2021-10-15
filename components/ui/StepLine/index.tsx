import styled from "styled-components"
import tw from "twin.macro"

import { Badge } from "../Badge"

interface Props {
  status: "edit" | "done" | "disabled"
  stepNumber?: number
}

export const StepLine: React.FC<Props> = ({ status, stepNumber }) => {
  return (
    <Wrapper>
      <div>
        <Badge status={status} stepNumber={stepNumber} />
      </div>
      <Line />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`flex-col items-center hidden md:flex md:-left-3 md:relative`}
`

const Line = styled.div`
  ${tw`w-px bg-gray-200 h-full hidden md:block`}
`
