import classNames from "classnames"
import { ReactNode } from "react"
import styled from "styled-components"
import tw from "twin.macro"

import useDeviceDetect from "components/hooks/useDeviceDetect"

interface Props {
  index: number
  header: ReactNode
  isActive: boolean
}

export const Accordion: React.FC = ({ children }) => {
  const { isMobile } = useDeviceDetect()
  return isMobile ? <Wrapper>{children}</Wrapper> : <>{children}</>
}

export const AccordionItem: React.FC<Props> = ({
  children,
  index,
  header,
  isActive,
}) => {
  const { isMobile } = useDeviceDetect()
  if (!isMobile) return <>{children}</>
  return (
    <AccordionTab
      tabIndex={index}
      className={classNames("group", {
        active: isActive,
      })}
    >
      <AccordionTabHeader className="group">
        <AccordionTitle>{header}</AccordionTitle>
        <AccordionIcon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </AccordionIcon>
      </AccordionTabHeader>
      <AccordionBody>{children}</AccordionBody>
    </AccordionTab>
  )
}

const Wrapper = styled.div`
  ${tw`overflow-hidden -mx-5`}
`
const AccordionTab = styled.div`
  ${tw`outline-none bg-white shadow-bottom mb-2 px-5`}
`
const AccordionTabHeader = styled.div`
  ${tw`relative flex items-start justify-between py-3 cursor-pointer transition ease duration-500 focus:bg-gray-500`}
`
const AccordionTitle = styled.div`
  ${tw`group-focus:text-gray-600 transition ease duration-500`}
`
const AccordionIcon = styled.div`
  ${tw`transform transition ease duration-500 group-focus:text-gray-900 group-focus:-rotate-180`}
`
const AccordionBody = styled.div`
  ${tw`overflow-hidden group-focus:max-h-full max-h-0 ease duration-500`}
  .active & {
    ${tw`max-h-full`}
  }
`
