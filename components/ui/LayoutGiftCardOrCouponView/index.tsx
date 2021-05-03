import styled from "styled-components"
import tw from "twin.macro"

interface ChildrenProps {
  className: string
}

interface Props {
  children: (props: ChildrenProps) => React.ReactNode
}

export const LayoutGiftCardOrCouponView: React.FC<Props> = ({ children }) => {
  return (
    <Wrapper>
      {children({
        className: `inline-flex items-center pr-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full py-0.5 pl-2.5`,
      })}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw``}
`
