import { NextPage } from "next"
import styled from "styled-components"
import "twin.macro"

import { Base } from "components/ui/Base"
import { Card } from "components/ui/Card"
import { Container } from "components/ui/Container"
import { Logo } from "components/ui/Logo"

const Invalid: NextPage = () => {
  return (
    <Base>
      <Container>
        <Wrapper>
          <Logo
            logoUrl="https://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo1.png"
            companyName="Test company"
            tw="pt-10 mb-10 pl-4"
          />

          <Card>
            <p tw="py-5 h-44 text-center">This checkout is not valid</p>
          </Card>
        </Wrapper>
      </Container>
    </Base>
  )
}

const Wrapper = styled.div`
  display: block;
  max-width: 600px;
  margin: 0 auto;
`

export default Invalid
