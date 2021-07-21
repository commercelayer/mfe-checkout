import "../styles/globals.css"
import { appWithTranslation } from "next-i18next"
import type { AppProps } from "next/app"
import "components/data/i18n"

function CheckoutApp(props: AppProps) {
  const { Component, pageProps } = props

  return <Component {...pageProps} />
}

export default appWithTranslation(CheckoutApp)
