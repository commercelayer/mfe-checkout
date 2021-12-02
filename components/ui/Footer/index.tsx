import styled from "styled-components"
import tw from "twin.macro"

import { Logo } from "./cl"

interface Props {
  onMobile?: boolean
}

export const Footer: React.FC<Props> = ({ onMobile }) => {
  return (
    <Wrapper onMobile={onMobile}>
      <LogoWrapper>
        Powered by <Logo width="135" height="22" tw="pl-2" />
      </LogoWrapper>
    </Wrapper>
  )
}

interface FooterProps {
  onMobile?: boolean
}

const Wrapper = styled.div<FooterProps>`
  ${({ onMobile }) => (onMobile ? tw`fixed md:hidden` : tw`hidden md:flex `)}
  ${tw`w-full bottom-0 justify-start items-center border-t px-5 py-2 text-xs text-gray-500 bg-gray-100 z-30 md:(bottom-0 sticky p-0 py-3 m-0 mt-20)`}

  &::before {
    ${tw`hidden md:(block top-0 absolute left-0 w-full z-10 h-2 shadow-top)`}

    content: "";
  }
`
const LogoWrapper = styled.div`
  ${tw`flex items-center`}
`
// const ListWrapper = styled.div`
//   ${tw`overflow-hidden`}
// `
// const ListLink = styled.ul`
//   ${tw`flex flex-row flex-wrap justify-between -ml-0.5`}
// `
// const ListItem = styled.li`
//   ${tw`flex-grow px-1.5 md:px-4 border-l font-medium`}
//   &:last-child {
//     ${tw`pr-0`}
//   }
// `
