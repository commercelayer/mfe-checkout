import styled, { css } from "styled-components"
import tw from "twin.macro"

import { CheckmarkIcon } from "./CheckmarkIcon"

interface Props {
  status: "add" | "done" | "disabled"
  label: string
  info: string
  stepNumber?: number
  onEditRequest?: () => void
}

export const StepHeader: React.FC<Props> = ({
  status,
  label,
  info,
  stepNumber,
  onEditRequest,
}) => {
  return (
    <Wrapper disabled={status === "disabled"}>
      <Badge>{status === "done" ? <CheckmarkIcon /> : stepNumber}</Badge>
      <Body>
        <Top>
          <Title>{label}</Title>
          {status === "done" ? (
            <Edit>
              &mdash; <EditButton onClick={onEditRequest}>Edit</EditButton>
            </Edit>
          ) : null}
        </Top>
        <Info>{info}</Info>
      </Body>
    </Wrapper>
  )
}

interface WrapperProps {
  disabled?: boolean
}

const Wrapper = styled.div<WrapperProps>`
  ${tw`flex items-start px-4`}
  ${({ disabled }) =>
    disabled
      ? css`
          filter: saturate(0);
        `
      : null}
`

const Body = styled.div`
  ${tw`pl-3`}
`

const Top = styled.div`
  ${tw`flex items-center`}
`

const Edit = styled.div`
  ${tw`ml-2`}
`

const EditButton = styled.button`
  ${tw` text-sm text-blue-500 hover:underline hover:text-blue-700`}
`

const Badge = styled.div`
  ${tw`mt-1 rounded-full bg-blue-400 text-white flex justify-center items-center w-6 h-6 text-xs font-bold`}
`

const Title = styled.div`
  ${tw`text-lg font-bold`}
`

const Info = styled.div`
  ${tw`text-gray-400 text-sm italic`}
`
