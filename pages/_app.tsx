import "../styles/globals.css"
import { useEffect } from "react"
import { CommerceLayer, OrderContainer } from "@commercelayer/react-components"
import type { AppProps } from "next/app"
import { AppContextType } from "next/dist/next-server/lib/utils"
import { createGlobalStyle, ThemeProvider } from "styled-components"

import { AppProvider } from "components/data/AppProvider"
import { GTMProvider } from "components/data/GTMProvider"
import { appWithTranslation } from "components/data/i18n"

interface GlobalStyleProps {
  primaryColor: string
  contrastColor: string
}
const GlobalCssStyle = createGlobalStyle<GlobalStyleProps>`
  :root {
    --primary: ${({ primaryColor }) => primaryColor};
    --contrast: ${({ contrastColor }) => contrastColor};
  }
`

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
      <GlobalCssStyle
        primaryColor={pageProps.primaryColor}
        contrastColor={pageProps.contrastColor}
      />
      <OrderContainer orderId={pageProps.orderId}>
        <ThemeProvider
          theme={{
            colors: {
              primary: pageProps.primaryColor,
              contrast: pageProps.contrastColor,
            },
          }}
        >
          <AppProvider
            orderId={pageProps.orderId}
            accessToken={pageProps.accessToken}
          >
            <GTMProvider gtmId={pageProps.gtmId}>
              <Component {...pageProps} />
            </GTMProvider>
          </AppProvider>
        </ThemeProvider>
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
    const redirectUrl = appContext.ctx.query?.redirectUrl
    if (redirectUrl) {
      appContext.ctx.res.writeHead(302, { Location: redirectUrl }).end()
    } else if (redirectUrl === undefined) {
      appContext.ctx.res.writeHead(302, { Location: "/invalid" }).end()
    }
  }

  const checkoutContext: CheckoutPageContextProps = {
    orderId: data.orderId,
    accessToken: data.accessToken,
    companyName: data.companyName,
    logoUrl: data.logoUrl,
    language: data.language,
    endpoint: data.endpoint,
    primaryColor: data.primaryColor,
    contrastColor: data.contrastColor,
    favicon: data.favicon,
    gtmId: data.gtmId,
  }

  return {
    pageProps: { ...checkoutContext }, // will be passed to the page component as props
  }
}

export default appWithTranslation(CheckoutApp)
