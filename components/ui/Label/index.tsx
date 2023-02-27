import styled from "styled-components"
import tw from "twin.macro"

interface Props {
  dataTestId?: string
  htmlFor: string
  textLabel?: string
  children?: JSX.Element[] | JSX.Element | null
}

export const Label: React.FC<Props> = ({
  dataTestId,
  htmlFor,
  textLabel,
  children,
}) => {
  return (
    <Wrapper data-testid={dataTestId} htmlFor={htmlFor}>
      {children || textLabel}
    </Wrapper>
  )
}

const Wrapper = styled.label`
  ${tw`ml-2 cursor-pointer text-sm text-gray-500`}
  &.hasError {
    ${tw`text-red-400`}
  }

  a {
    ${tw`text-gray-900 border-b border-gray-200 transition ease hover:text-gray-500`}
  }
`
