import {
  CommerceLayer,
  OrderContainer,
  LineItemsContainer,
  LineItem,
  LineItemImage,
  LineItemName,
  LineItemQuantity,
  LineItemAmount,
  LineItemsCount,
} from "@commercelayer/react-components"
import { NextPage } from "next"
import "twin.macro"
import Head from "next/head"

import { LayoutDefault } from "components/layouts/LayoutDefault"
import { Base } from "components/ui/Base"
import { Card } from "components/ui/Card"
import { Container } from "components/ui/Container"
import { Logo } from "components/ui/Logo"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"

interface Props {
  accessToken: string
  endpoint: string
  logoUrl: string
  companyName: string
}

const Home: NextPage<Props> = ({
  accessToken,
  endpoint,
  logoUrl,
  companyName,
}) => {
  return (
    <div>
      <Head>
        <title>Commerce Layer - Hosted Checkout</title>
      </Head>
      <CommerceLayer accessToken={accessToken} endpoint={endpoint}>
        <OrderContainer orderId="NZrQherdeL">
          <Base>
            <Container>
              <Logo
                logoUrl={logoUrl}
                companyName={companyName}
                tw="mb-10 pl-4"
              />
              <LayoutDefault.Wrapper>
                <LayoutDefault.Main>
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
                </LayoutDefault.Main>
                <LayoutDefault.Aside>
                  <LineItemsContainer>
                    <h4 tw="text-lg mb-5 font-bold">
                      Your shopping cart contains <LineItemsCount /> items
                    </h4>
                    <LineItem>
                      <div tw="flex flex-row mb-4">
                        <LineItemImage width={50} />
                        <div tw="pl-4">
                          <LineItemName />
                          <div tw="flex flex-row justify-between">
                            <LineItemQuantity>
                              {(props) => (
                                <p tw="text-gray-400">
                                  Quantity: {props.quantity}
                                </p>
                              )}
                            </LineItemQuantity>
                            <div tw="font-bold">
                              <LineItemAmount className="text-red-500" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </LineItem>
                  </LineItemsContainer>
                </LayoutDefault.Aside>
              </LayoutDefault.Wrapper>
            </Container>
          </Base>
        </OrderContainer>
      </CommerceLayer>
    </div>
  )
}

export default Home
