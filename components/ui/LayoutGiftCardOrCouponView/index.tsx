import styled from "styled-components"
import tw from "twin.macro"

interface ChildrenProps {
  giftCardOrCouponCodeClass: string
  giftCardOrCouponRemoveButtonClass: string
}

interface Props {
  children: (props: ChildrenProps) => React.ReactNode
}

export const LayoutGiftCardOrCouponView: React.FC<Props> = ({ children }) => {
  return (
    <Wrapper>
      {children({
        giftCardOrCouponCodeClass: `inline-flex items-center pr-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full py-0.5 pl-2.5`,
        giftCardOrCouponRemoveButtonClass: `inline-flex items-center justify-center flex-shrink-0 w-4 h-4 text-indigo-400 rounded-full ml-0.5 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white`,
      })}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw``}
`
