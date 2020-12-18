import "../styles/globals.css"
import type { AppProps } from "next/app"
import { AppContextType } from "next/dist/next-server/lib/utils"

function CheckoutApp(props: AppProps) {
  const { Component, pageProps } = props
  return <Component {...pageProps} />
}

CheckoutApp.getInitialProps = async (appContext: AppContextType) => {
  const res = await fetch("http://localhost:3000/api/settings", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appContext.ctx.query),
  })
  // console.log("data", res)
  const data = await res.json()
  console.log("data", data)
  // console.log("ctx res", appContext.ctx.res)
  if (
    !data.validCheckout &&
    appContext.ctx.res &&
    appContext.ctx.pathname !== "/invalid"
  ) {
    appContext.ctx.res.writeHead(302, { Location: "/invalid" }).end()
  }

  return {
    pageProps: { ...data }, // will be passed to the page component as props
  }
}

export default CheckoutApp
