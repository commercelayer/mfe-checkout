import { NextPage } from "next"
import "twin.macro"
import Head from "next/head"

import { OrderRecap } from "components/composite/OrderRecap"
import { StepCustomer } from "components/composite/StepCustomer"
import { StepShipping } from "components/composite/StepShipping"
import { LayoutDefault } from "components/layouts/LayoutDefault"
import { Logo } from "components/ui/Logo"

const Home: NextPage<CheckoutPageContextProps> = ({ logoUrl, companyName }) => {
  return (
    <div>
      <Head>
        <title>Commerce Layer - Hosted Checkout</title>
      </Head>
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
    </div>
  )
}

export default Home
