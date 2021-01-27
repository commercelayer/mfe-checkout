import styled, { css } from "styled-components"
import tw from "twin.macro"

const STEP_HEIGHT = 48
const STEP_ARROW_WIDTH = 16
const STEP_BG = "rgba(243, 244, 246, 1)"
const STEP_BG_ACTIVE = "#3b82f6"

interface StepProps {
  isActive?: boolean
  isLocked?: boolean
}

export const Step = styled.div<StepProps>`
  position: relative;
  height: ${STEP_HEIGHT}px;
  ${tw`pl-3 pr-5 text-sm flex flex-col text-center items-center flex-1 bg-gray-100 py-3`}

  --bg-color: ${STEP_BG};

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    border-left: ${STEP_ARROW_WIDTH}px solid white;
    border-top: ${STEP_HEIGHT / 2}px solid transparent;
    border-bottom: ${STEP_HEIGHT / 2}px solid transparent;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    border-left: ${STEP_ARROW_WIDTH}px solid var(--bg-color);
    border-top: ${STEP_HEIGHT / 2}px solid white;
    border-bottom: ${STEP_HEIGHT / 2}px solid white;
  }

  &:first-of-type {
    &::before {
      content: none;
    }
  }

  ${({ isActive }) =>
    isActive
      ? css`
          ${tw`font-extrabold bg-blue-500 text-white`}

          --bg-color: ${STEP_BG_ACTIVE};
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
