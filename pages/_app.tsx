import "../styles/globals.css"
import { CommerceLayer, OrderContainer } from "@commercelayer/react-components"
import { AppProvider } from "components/data/AppProvider"
import { GTMProvider } from "components/data/GTMProvider"
import i18n from "i18next"
import { appWithTranslation } from "next-i18next"
import type { AppProps } from "next/app"
import { AppContextType } from "next/dist/next-server/lib/utils"
import translationEN from "public/static/locales/en/common.json"
import translationIT from "public/static/locales/it/common.json"
import { initReactI18next } from "react-i18next"
import { createGlobalStyle, ThemeProvider } from "styled-components"

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

  const languages = ["en", "it"]

  const resources = {
    en: {
      translation: translationEN,
    },
    it: {
      translation: translationIT,
    },
  }

  i18n.use(initReactI18next).init({
    resources,
    lng: languages[0],
    fallbackLng: languages,
  })

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
    appContext.ctx.res.writeHead(302, { Location: "/invalid" }).end()
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
    supportEmail: data.supportEmail,
    supportPhone: data.supportPhone,
  }

  return {
    pageProps: { ...checkoutContext }, // will be passed to the page component as props
  }
}

export default appWithTranslation(CheckoutApp)
