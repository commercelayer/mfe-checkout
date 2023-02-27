import styled from "styled-components"
import tw from "twin.macro"

export const Container = ({ children }: { children?: JSX.Element[] | JSX.Element | null }) => <Fluid>{children}</Fluid>

const Fluid = styled.div`
  ${tw`container 2xl:max-w-screen-2xl 2xl:mx-auto`}
`
