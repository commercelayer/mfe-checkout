import { NextPage } from "next"
import styled from "styled-components"
import tw from "twin.macro"

import { Base } from "components/ui/Base"
import { Card } from "components/ui/Card"
import { Container } from "components/ui/Container"
import { Logo } from "components/ui/Logo"

const Checkout: NextPage = () => {
  return (
    <Base>
      <Container>
        <Logo
          logoUrl="https://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo1.png"
          companyName="Test company"
          tw="mb-10 pl-4"
        />

        <Grid>
          <SectionSteps>
            <Card>
              <div tw="py-5 h-44">STEPS</div>
            </Card>
          </SectionSteps>
          <SectionRecap>
            <div tw="text-lg">RECAP</div>
          </SectionRecap>
        </Grid>
      </Container>
    </Base>
  )
}

const Grid = styled.div`
  ${tw`grid md:grid-cols-3 gap-4`}
`

const SectionSteps = styled.div`
  ${tw`md:col-span-2`}
`

const SectionRecap = styled.div`
  display: block;
`

export default Checkout
