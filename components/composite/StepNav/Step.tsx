import styled, { css } from "styled-components"
import tw from "twin.macro"

const STEP_BG_ACTIVE = "#3b82f6"

interface StepProps {
  isActive?: boolean
  isLocked?: boolean
}

export const Step = styled.div<StepProps>`
  position: relative;
  ${tw`pr-5 text-sm flex flex-col text-center items-center py-3 text-gray-600`}

  ${({ isActive }) =>
    isActive
      ? css`
          ${tw`font-bold text-primary`}
        `
      : null}
  ${({ isLocked }) =>
    isLocked
      ? css`
          ${tw`text-gray-400 pointer-events-none`}
        `
      : css`
          ${tw`cursor-pointer`}
        `}
`
