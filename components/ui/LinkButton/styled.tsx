import styled from "styled-components"
import tw from "twin.macro"

import LinkButtonProps from "./props"

export const Button = styled.a.attrs(
  (props: LinkButtonProps) => ({})
)<LinkButtonProps>`
  ${tw`text-ss font-bold cursor-pointer border-b border-gray-200 text-primary`}
`
