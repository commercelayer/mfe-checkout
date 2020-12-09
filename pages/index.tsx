import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {
  CommerceLayer,
  PricesContainer,
  Price,
  OrderContainer,
  LineItemsContainer,
  LineItem,
  LineItemName
} from '@commercelayer/react-components'


export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!!</a>
        </h1>

        <CommerceLayer accessToken="eyJhbGciOiJIUzUxMiJ9.eyJvcmdhbml6YXRpb24iOnsiaWQiOjIwNTd9LCJhcHBsaWNhdGlvbiI6eyJpZCI6MjkxNSwia2luZCI6IndlYmFwcCIsInB1YmxpYyI6ZmFsc2V9LCJ0ZXN0Ijp0cnVlLCJvd25lciI6eyJpZCI6MjgzNzEsInR5cGUiOiJVc2VyIn0sImV4cCI6MTYwNzUxODY3MiwibWFya2V0Ijp7ImlkIjozNzk2LCJwcmljZV9saXN0X2lkIjozNzc0LCJzdG9ja19sb2NhdGlvbl9pZHMiOlszOTI4LDM5MjldLCJnZW9jb2Rlcl9pZCI6bnVsbCwiYWxsb3dzX2V4dGVybmFsX3ByaWNlcyI6ZmFsc2V9LCJyYW5kIjowLjk2NjgyODkxNTIwODI5NzF9.oOInyfXuKWv3k8uMLQnBhFWcggvDA7RGqW8iuWmPW_FH9pnyu1cs14cD_ji8satPRb68zFJnSlGneTPC7SQY5Q" 
        endpoint="https://the-green-brand-120.commercelayer.io">
  <PricesContainer>
    <Price
      skuCode="BABYONBU000000E63E7412MX"
      className="your-custom-class"
      compareClassName="your-custom-class"
      // showCompare={false}
    />
    
  </PricesContainer>

    
</CommerceLayer>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h3>Learn &rarr;</h3>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
