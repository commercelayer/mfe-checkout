import { useTranslation } from "react-i18next"
import styled, { css } from "styled-components"
import tw from "twin.macro"

import { CheckmarkIcon } from "./CheckmarkIcon"

interface Props {
  status: "edit" | "done" | "disabled"
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
  const { t } = useTranslation()

  return (
    <Wrapper disabled={status === "disabled"}>
      <Badge>{status === "done" ? <CheckmarkIcon /> : stepNumber}</Badge>
      <Body>
        <Top>
          <Title data-cy="step-header-customer">{label}</Title>
          {status === "done" ? (
            <Edit>
              {" "}
              <EditButton
                data-cy={`edit-step-${stepNumber}-button`}
                onClick={onEditRequest}
              >
                {t("general.edit")}
              </EditButton>
            </Edit>
          ) : null}
        </Top>
        <Info data-cy="step-header-info">{info}</Info>
      </Body>
    </Wrapper>
  )
}

interface WrapperProps {
  disabled?: boolean
}

const Wrapper = styled.div<WrapperProps>`
  ${tw`flex items-start`}
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
  ${tw` text-sm font-bold text-primary border-b border-primary leading-none hover:opacity-50 focus:outline-none`}
`

const Badge = styled.div`
  ${tw`mt-1 rounded-full bg-primary text-white flex justify-center items-center w-6 h-6 text-xs font-bold`}
`

const Title = styled.h2`
  ${tw`text-lg font-semibold`}
`

const Info = styled.p`
  ${tw`text-gray-500 text-sm`}
`
