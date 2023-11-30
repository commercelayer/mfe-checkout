import { css } from "styled-components"
import tw from "twin.macro"

export const InputCss = css`
  ${tw`text-black block w-full border-gray-300 border rounded-md shadow-sm p-3 transition duration-100 ease-in-out focus:border-primary focus:ring focus:ring-offset-0 focus:ring-primary-light focus:ring-opacity-50  sm:text-sm`}

  &:-webkit-autofill {
    &,
    &:focus {
      ${tw`shadow-inner transition-bg duration-[5000s] ease-in-out delay-[0ms]`}
    }
  }
`
