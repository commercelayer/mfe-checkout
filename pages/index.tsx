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
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;1,400&display=swap"
        rel="stylesheet"
      />
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

// export async function getServerSideProps(context: NextPageContext) {
//   const res = await fetch("http://localhost:3000/api/settings", {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(context.query),
//   })
//   const data = await res.json()

//   return {
//     props: { ...data }, // will be passed to the page component as props
//   }
// }

export default Home
