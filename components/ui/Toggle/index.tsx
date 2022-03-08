import styled from "styled-components"
import tw from "twin.macro"

interface Props {
  label: string
  checked: boolean
  onChange: () => void
  className?: string
  disabled: boolean
}

export const Toggle: React.FC<Props> = ({
  label,
  checked,
  onChange,
  className,
  disabled,
  ...rest
}) => {
  return (
    <Wrapper>
      <ButtonToggle className={className} checked={checked}>
        <ButtonTrack
          disabled={disabled}
          {...rest}
          type="button"
          onClick={onChange}
        >
          <span className="sr-only">Use setting</span>
          <Dot aria-hidden="true" />
        </ButtonTrack>
        <Label>{label}</Label>
      </ButtonToggle>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`mt-5 py-4 border-t`}
`

const ButtonTrack = styled.button`
  ${tw`mt-0.5 relative inline-flex flex-shrink-0 h-4 w-7 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none`}
`

const Dot = styled.span`
  ${tw` inline-block h-3 w-3 rounded-full bg-contrast shadow ring-0 transition ease-in-out duration-200`}
`

const Label = styled.span`
  ${tw`ml-2 cursor-pointer text-sm text-gray-500`}
`

interface WrapperProps {
  checked: boolean
}
const ButtonToggle = styled.label<WrapperProps>`
  ${tw`flex`}
  ${ButtonTrack} {
    ${({ checked }) => (checked ? tw`bg-primary` : tw`bg-gray-200`)}
  }
  ${Dot} {
    ${({ checked }) => (checked ? tw`translate-x-3` : tw`translate-x-0`)}
  }
`
