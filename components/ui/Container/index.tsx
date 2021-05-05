import styled from "styled-components"
import tw from "twin.macro"

export const Container: React.FC = ({ children }) => <Fluid>{children}</Fluid>

const Fluid = styled.div`
  ${tw`container`}
`
