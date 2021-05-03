import styled from "styled-components"
import tw from "twin.macro"

interface Props {
  title?: string
  leftIcon?: React.ReactNode
  input: React.ReactNode
  submit: React.ReactNode
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
  input,
  submit,
}) => {
  return (
    <Wrapper>
      <WrapperLable htmlFor="email">
        {title || "Coupon / Gift Card"}
      </WrapperLable>
      <WrapperForm>
        <WrapperInput>
          <WrapperLeftIcon>{leftIcon || defaultLeftIcon}</WrapperLeftIcon>
          {input}
        </WrapperInput>
        {submit}
      </WrapperForm>
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
