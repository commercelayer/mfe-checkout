import styled from "styled-components"
import tw from "twin.macro"

export const CheckIcon: React.FC = () => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      className=""
      fill="currentColor"
      id="animated-tick"
      x="0px"
      y="0px"
      viewBox="0 0 110 110"
    >
      <polyline className="tick" points="85,30 51,80 25,61.3 " />
      <circle className="tick" cx="55" cy="55" r="50" />
    </Svg>
  )
}

const Svg = styled.svg`
  ${tw`text-contrast w-3/5`}
`
