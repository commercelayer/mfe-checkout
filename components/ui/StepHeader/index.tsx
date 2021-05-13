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
      <Badge active={status === "edit"}>
        {status === "done" ? <CheckmarkIcon /> : stepNumber}
      </Badge>
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

interface BadgeProps {
  active: boolean
}

const Wrapper = styled.div<WrapperProps>`
  ${tw`flex items-start mb-4`}
  ${({ disabled }) =>
    disabled
      ? css`
          filter: saturate(0);
        `
      : null}
`

const Body = styled.div`
  ${tw``}
`

const Top = styled.div`
  ${tw`flex items-start mb-1.5`}
`

const Edit = styled.div`
  ${tw`ml-2 flex self-end`}
`

const EditButton = styled.button`
  ${tw`text-sm font-bold text-primary border-b leading-none border-black border-opacity-10 md: transition ease-in duration-200 hover:border-opacity-50 hover:text-primary-dark focus:outline-none`}
`

const Badge = styled.div<BadgeProps>(({ active }) => [
  tw`rounded-full text-white flex justify-center items-center w-6 h-6 text-xs font-bold absolute -left-3`,
  active && tw`bg-primary`,
  !active && tw`bg-gray-400`,
])

const Title = styled.h2`
  ${tw`text-lg font-semibold leading-none`}
`

const Info = styled.p`
  ${tw`text-gray-500 text-sm`}
`
