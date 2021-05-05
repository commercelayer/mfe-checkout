import styled, { css } from "styled-components"
import tw from "twin.macro"

const STEP_BG_ACTIVE = "#3b82f6"

interface StepProps {
  isActive?: boolean
  isLocked?: boolean
}

export const Step = styled.li<StepProps>`
  position: relative;
  ${tw`flex items-center`}

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
