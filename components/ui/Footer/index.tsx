import styled from "styled-components"
import tw from "twin.macro"

import { Logo } from "./cl"

export const Footer: React.FC = () => {
  return (
    <Wrapper>
      <LogoWrapper>
        Powered by <Logo />
      </LogoWrapper>
      <ListWrapper>
        <ListLink>
          <ListItem>
            <a href="">Terms</a>
          </ListItem>
          <ListItem>
            <a href="">Privacy</a>
          </ListItem>
        </ListLink>
      </ListWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`flex justify-between mt-20 border-t pt-3 text-xs text-gray-500 lg:pb-6`}
`
const LogoWrapper = styled.div`
  ${tw`flex`}
`
const ListWrapper = styled.div`
  ${tw`overflow-hidden`}
`
const ListLink = styled.ul`
  ${tw`flex flex-row flex-wrap justify-between -ml-0.5`}
`
const ListItem = styled.li`
  ${tw`flex-grow px-4 border-l font-medium`}
`
