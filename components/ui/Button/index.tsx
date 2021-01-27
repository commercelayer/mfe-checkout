import styled, { css } from "styled-components"
import tw from "twin.macro"

export const ButtonCss = css`
  ${tw`inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent shadow-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
`

export const Button = styled.button`
  ${ButtonCss}
`
