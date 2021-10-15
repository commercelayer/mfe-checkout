import styled from "styled-components"
import tw from "twin.macro"

interface Props {
  dataCy?: string
  htmlFor: string
  textLabel?: string
}

export const Label: React.FC<Props> = ({
  dataCy,
  htmlFor,
  textLabel,
  children,
}) => {
  return (
    <Wrapper data-cy={dataCy} htmlFor={htmlFor}>
      {children || textLabel}
    </Wrapper>
  )
}

const Wrapper = styled.label`
  ${tw`ml-2 cursor-pointer text-sm text-gray-600`}
  &.hasError {
    ${tw`text-red-400`}
  }

  a {
    ${tw`text-gray-900 border-b border-gray-200 transition ease hover:text-gray-600`}
  }
`
