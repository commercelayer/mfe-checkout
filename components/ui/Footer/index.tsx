import { useTranslation } from "react-i18next"
import styled from "styled-components"
import tw from "twin.macro"

import { Logo } from "./cl"

interface Props {
  termsUrl?: string
  privacyUrl?: string
  onMobile?: boolean
}

export const Footer: React.FC<Props> = ({ termsUrl, privacyUrl, onMobile }) => {
  const { t } = useTranslation()
  return (
    <Wrapper onMobile={onMobile}>
      <a
        target="_blank"
        href="https://commercelayer.io/"
        rel="noreferrer"
        className="group"
      >
        <LogoWrapper>
          Powered by <Logo width="135" height="22" tw="pl-2" />
        </LogoWrapper>
      </a>
      {(termsUrl || privacyUrl) && (
        <ListWrapper>
          <ListLink>
            {termsUrl && (
              <ListItem>
                <a target="_blank" href={termsUrl} rel="noreferrer">
                  {t("general.terms_link")}
                </a>
              </ListItem>
            )}
            {privacyUrl && (
              <ListItem>
                <a target="_blank" href={privacyUrl} rel="noreferrer">
                  {t("general.privacy_link")}
                </a>
              </ListItem>
            )}
          </ListLink>
        </ListWrapper>
      )}
    </Wrapper>
  )
}

interface FooterProps {
  onMobile?: boolean
}

const Wrapper = styled.div<FooterProps>`
  ${({ onMobile }) => (onMobile ? tw`flex md:hidden` : tw`hidden md:flex `)}
  ${tw`justify-between items-center border-t m-5 mt-0 pt-5 text-xs text-gray-500 relative md:(z-20 bottom-0 sticky p-0 py-3 m-0 mt-20 bg-gray-100)`}

  &::before {
    ${tw`hidden md:(block top-0 absolute left-0 w-full z-10 h-2 shadow-top)`}

    content: "";
  }
`
const LogoWrapper = styled.div`
  ${tw`flex items-center`}
`
const ListWrapper = styled.div`
  ${tw`overflow-hidden`}
`
const ListLink = styled.ul`
  ${tw`flex flex-row flex-wrap justify-between -ml-0.5`}
`
const ListItem = styled.li`
  ${tw`flex-grow px-1.5 md:px-4 border-l font-medium`}
  &:last-child {
    ${tw`pr-0`}
  }
`
