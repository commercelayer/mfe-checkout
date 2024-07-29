import styled from "styled-components"
import tw from "twin.macro"

import { Badge } from "../Badge"

interface Props {
  status: "edit" | "done" | "disabled" | "skip"
  label: string
  info: string | Element | JSX.Element
  stepNumber?: number
  onEditRequest?: () => void
}

export const StepHeader: React.FC<Props> = ({
  status,
  label,
  info,
  stepNumber,
}) => {
  return (
    <Wrapper disabled={status === "disabled"}>
      <Body>
        <Top>
          <Badge status={status} stepNumber={stepNumber} />
          <Title data-testid="step-header-customer">{label}</Title>
        </Top>
        <Info data-testid="step-header-info">
          <>{info}</>
        </Info>
      </Body>
    </Wrapper>
  )
}

interface WrapperProps {
  disabled?: boolean
}

const Wrapper = styled.div<WrapperProps>`
  ${tw`flex items-start mb-1.5 md:pl-0 md:mb-5`}
`

const Body = styled.div`
  ${tw``}
`

const Top = styled.div`
  ${tw`flex items-center mb-0.5`}
`

const Title = styled.h2`
  ${tw`text-lg font-semibold leading-none pl-2`}
`

const Info = styled.div`
  ${tw`text-gray-400 text-sm pl-8`}
`
