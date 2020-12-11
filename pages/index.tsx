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
import Head from "next/head"

interface Props {
  accessToken: string
}

const Home: NextPage<Props> = ({ accessToken }) => (
  <div>
    <Head>
      <title>Create Next App</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main>
      <h1>
        Welcome to <a href="https://nextjs.org">Next.js!!</a>
      </h1>
      <button className="btn-blue">click me</button>

      <CommerceLayer
        accessToken={accessToken}
        endpoint="https://the-green-brand-120.commercelayer.io"
      >
        <OrderContainer orderId="NZrQherdeL">
          <LineItemsContainer>
            <p className="your-custom-class">
              Your shopping cart contains <LineItemsCount /> items
            </p>
            <LineItem>
              <LineItemImage width={50} />
              <LineItemName />
              <LineItemQuantity>
                {(props) => <p className="text-red-500">{props.quantity}</p>}
              </LineItemQuantity>

              <LineItemAmount className="text-red-500" />
            </LineItem>
          </LineItemsContainer>
        </OrderContainer>
      </CommerceLayer>
    </main>
  </div>
)

export async function getStaticProps() {
  const res = await fetch(
    `https://${process.env.CLAYER_DOMAIN}.commercelayer.io/oauth/token`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: process.env.CLAYER_CLIENT_ID,
        scope: process.env.CLAYER_SCOPE,
      }),
    }
  )
  const json = await res.json()
  return { props: { accessToken: json.access_token } }
}

export default Home
