import "../styles/globals.css"
import { CommerceLayer, OrderContainer } from "@commercelayer/react-components"
import type { AppProps } from "next/app"
import { AppContextType } from "next/dist/next-server/lib/utils"

import { AppProvider } from "components/data/AppProvider"

import { appWithTranslation } from "../i18n"

if (
  process.env.NEXT_PUBLIC_API_MOCKING === "enabled" &&
  process.env.CYPRESS_RECORD === "false"
) {
  require("../mocks")
}

function CheckoutApp(props: AppProps) {
  const { Component, pageProps } = props

  return pageProps.accessToken && pageProps.orderId ? (
    <CommerceLayer
      accessToken={pageProps.accessToken}
      endpoint={pageProps.endpoint}
    >
      <OrderContainer orderId={pageProps.orderId}>
        <AppProvider
          orderId={pageProps.orderId}
          accessToken={pageProps.accessToken}
        >
          <Component {...pageProps} />
        </AppProvider>
      </OrderContainer>
    </CommerceLayer>
  ) : (
    <Component {...pageProps} />
  )
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

  const checkoutContext: CheckoutPageContextProps = {
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

export default appWithTranslation(CheckoutApp)
