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

  const data: CheckoutSettings = await res.json()

  if (
    !data.validCheckout &&
    appContext.ctx.res &&
    appContext.ctx.pathname !== "/invalid"
  ) {
    appContext.ctx.res.writeHead(302, { Location: "/invalid" }).end()
  }

  const checkoutContext: CheckoutContextProps = {
    orderId: data.orderId,
    accessToken: data.accessToken,
    companyName: data.companyName,
    logoUrl: data.logoUrl,
    endpoint: data.endpoint,
  }

  return {
    pageProps: { ...checkoutContext }, // will be passed to the page component as props
  }
}

export default CheckoutApp
