import {
  CommerceLayer,
  PricesContainer,
  Price,
  OrderContainer,
  LineItemsContainer,
  LineItem,
  LineItemName,
} from "@commercelayer/react-components"
import Head from "next/head"

export default function Home() {
  return (
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
          accessToken="eyJhbGciOiJIUzUxMiJ9.eyJvcmdhbml6YXRpb24iOnsiaWQiOjIwNTd9LCJhcHBsaWNhdGlvbiI6eyJpZCI6MjkxNSwia2luZCI6IndlYmFwcCIsInB1YmxpYyI6ZmFsc2V9LCJ0ZXN0Ijp0cnVlLCJvd25lciI6eyJpZCI6MjgzNzEsInR5cGUiOiJVc2VyIn0sImV4cCI6MTYwNzUxODY3MiwibWFya2V0Ijp7ImlkIjozNzk2LCJwcmljZV9saXN0X2lkIjozNzc0LCJzdG9ja19sb2NhdGlvbl9pZHMiOlszOTI4LDM5MjldLCJnZW9jb2Rlcl9pZCI6bnVsbCwiYWxsb3dzX2V4dGVybmFsX3ByaWNlcyI6ZmFsc2V9LCJyYW5kIjowLjk2NjgyODkxNTIwODI5NzF9.oOInyfXuKWv3k8uMLQnBhFWcggvDA7RGqW8iuWmPW_FH9pnyu1cs14cD_ji8satPRb68zFJnSlGneTPC7SQY5Q"
          endpoint="https://the-green-brand-120.commercelayer.io"
        >
          <PricesContainer>
            <Price
              skuCode="BABYONBU000000E63E7412MX"
              className="your-custom-class"
              compareClassName="your-custom-class"
              // showCompare={false}
            />
          </PricesContainer>
        </CommerceLayer>
      </main>
    </div>
  )
}
