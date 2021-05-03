import styled from "styled-components"
import tw from "twin.macro"

interface InputProps {
  className: string
}

interface SubmitProps {
  className: string
}

interface ErrorProps {
  className: string
}

interface Props {
  title?: string
  leftIcon?: React.ReactNode
  codeError: boolean
  input: (props: InputProps) => React.ReactNode
  submit: (props: SubmitProps) => React.ReactNode
  error: (props: ErrorProps) => React.ReactNode
}

const defaultLeftIcon = (
  <svg
    className="w-5 h-5 text-gray-400"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
    />
  </svg>
)

export const LayoutGiftCardOrCouponForm: React.FC<Props> = ({
  title,
  leftIcon,
  codeError,
  input,
  submit,
  error,
}) => {
  const classError = codeError
    ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
    : ""

  return (
    <Wrapper>
      <WrapperLable htmlFor="email">
        {title || "Coupon / Gift Card"}
      </WrapperLable>
      <WrapperForm>
        <WrapperInput>
          <WrapperLeftIcon>{leftIcon || defaultLeftIcon}</WrapperLeftIcon>
          {input({
            className: `${classError} focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300`,
          })}
        </WrapperInput>
        {submit({
          className: `${classError} -ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`,
        })}
      </WrapperForm>
      {error({
        className: classError,
      })}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw``}
`

const WrapperLable = styled.label`
  ${tw`block text-sm font-medium text-gray-700`}
`

const WrapperForm = styled.div`
  ${tw`mt-1 flex rounded-md shadow-sm`}
`

const WrapperInput = styled.div`
  ${tw`relative flex items-stretch flex-grow focus-within:z-10`}
`

const WrapperLeftIcon = styled.div`
  ${tw`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none`}
`
