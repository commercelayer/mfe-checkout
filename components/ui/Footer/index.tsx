import styled from "styled-components"
import tw from "twin.macro"

import { Logo } from "./cl"

export const Footer: React.FC = () => {
  return (
    <Wrapper>
      <LogoWrapper>
        Powered by <Logo width="135" height="22" className="pl-2" />
      </LogoWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`md:flex fixed w-full bottom-0 justify-start items-center border-t -mx-5 px-5 py-2 text-xs text-gray-400 bg-gray-50 z-30 md:(bottom-0 sticky p-0 py-3 m-0 mt-20)`}

  &::before {
    ${tw`hidden md:(block top-0 absolute left-0 w-full z-10 h-2 shadow-top)`}

    content: "";
  }
`
const LogoWrapper = styled.div`
  ${tw`flex items-center`}
`
