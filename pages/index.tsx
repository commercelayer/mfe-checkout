import { CommerceLayer, OrderContainer } from "@commercelayer/react-components"
import { NextPage } from "next"
import "twin.macro"
import Head from "next/head"

import { OrderRecap } from "components/composite/OderRecap"
import { StepCustomer } from "components/composite/StepCustomer"
import { StepShipping } from "components/composite/StepShipping"
import { LayoutDefault } from "components/layouts/LayoutDefault"
import { Logo } from "components/ui/Logo"

const Home: NextPage<CheckoutPageContextProps> = ({
  accessToken,
  endpoint,
  logoUrl,
  companyName,
  orderId,
}) => {
  return (
    <div>
      <Head>
        <title>Commerce Layer - Hosted Checkout</title>
      </Head>
      <CommerceLayer accessToken={accessToken} endpoint={endpoint}>
        <OrderContainer orderId={orderId}>
          <LayoutDefault
            aside={
              <div>
                <Logo logoUrl={logoUrl} companyName={companyName} />
                <OrderRecap />
              </div>
            }
            main={
              <div>
                <StepCustomer tw="mb-6" />
                <StepShipping tw="mb-6" />
              </div>
            }
          />
        </OrderContainer>
      </CommerceLayer>
    </div>
  )
}

export default Home
