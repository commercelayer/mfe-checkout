import styled from "styled-components"
import tw from "twin.macro"

interface Props {
  label: string
  checked: boolean
  onChange: () => void
  className?: string
}

export const Toggle: React.FC<Props> = ({
  label,
  checked,
  onChange,
  className,
  ...rest
}) => {
  return (
    <Wrapper className={className} checked={checked}>
      <ButtonTrack {...rest} type="button" onClick={onChange}>
        <span tw="sr-only">Use setting</span>
        <Dot aria-hidden="true" />
      </ButtonTrack>
      <Label>{label}</Label>
    </Wrapper>
  )
}

const ButtonTrack = styled.button`
  ${tw`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
`

const Dot = styled.span`
  ${tw` inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
`

const Label = styled.span`
  ${tw`ml-5 cursor-pointer `}
`

interface WrapperProps {
  checked: boolean
}
const Wrapper = styled.label<WrapperProps>`
  ${tw`flex p-2`}
  ${ButtonTrack} {
    ${({ checked }) => (checked ? tw`bg-blue-500` : tw`bg-gray-200`)}
  }
  ${Dot} {
    ${({ checked }) => (checked ? tw`translate-x-5` : tw`translate-x-0`)}
  }
`
