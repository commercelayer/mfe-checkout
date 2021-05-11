import styled, { css } from "styled-components"
import tw from "twin.macro"

export const ButtonCss = css`
  ${tw`inline-flex items-center justify-center w-full p-3 text-xs font-extrabold text-white bg-primary border border-transparent rounded-md hover:opacity-80 disabled:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 md:w-48`}
`

export const ButtonWrapper = styled.div`
  ${tw`flex justify-end`}
`

export const Button = styled.button`
  ${ButtonCss}
`
