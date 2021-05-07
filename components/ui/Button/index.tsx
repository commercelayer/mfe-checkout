import styled, { css } from "styled-components"
import tw from "twin.macro"

export const ButtonCss = css`
  ${tw`inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent shadow-sm rounded-md hover:opacity-80 disabled:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50`}
`
export const ButtonWrapper = styled.div`
  ${tw`flex justify-end`}
`

export const Button = styled.button`
  ${ButtonCss}
`
