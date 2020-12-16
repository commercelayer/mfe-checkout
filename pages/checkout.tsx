import { NextPage } from "next"
import styled from "styled-components"
import tw from "twin.macro"

import { Base } from "components/ui/Base"
import { Card } from "components/ui/Card"
import { Container } from "components/ui/Container"
import { Logo } from "components/ui/Logo"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"

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
              <div tw="mb-6">
                <StepHeader
                  stepNumber={1}
                  status="done"
                  label="Customer"
                  info="Billing information and shipping address"
                />
                <StepContent>
                  <div>&lt;BillingAddressContainer&gt;</div>
                  <div>&lt;NextStepContainer&gt;</div>
                </StepContent>
              </div>

              <div tw="mb-6">
                <StepHeader
                  stepNumber={2}
                  status="edit"
                  label="Delivery"
                  info="Shipment summary and delivery methods"
                />
                <StepContent>
                  <div>&lt;ShippingAddressContainer&gt;</div>
                  <div>&lt;NextStepContainer&gt;</div>
                </StepContent>
              </div>
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
