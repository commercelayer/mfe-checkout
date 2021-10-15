import { css } from "styled-components"
import tw from "twin.macro"

export const InputCss = css`
  ${tw`block w-full border-gray-400 border rounded-md p-3 transition duration-500 ease-in-out focus:border-primary focus:ring focus:ring-offset-0 focus:ring-primary-light focus:ring-opacity-50  sm:text-sm`}

  &:-webkit-autofill {
    &,
    &:focus {
      ${tw`shadow-inner`}
    }
  }
`
