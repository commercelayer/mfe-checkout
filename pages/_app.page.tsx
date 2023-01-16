import type { AppProps } from "next/app"
import "../styles/globals.css"
// eslint-disable-next-line import/order
import { appWithTranslation } from "next-i18next"

import "components/data/i18n"

function CheckoutApp(props: AppProps) {
  const { Component, pageProps } = props

  return (
    <div suppressHydrationWarning>
      {typeof window === "undefined" ? null : <Component {...pageProps} />}
    </div>
  )
}

export default appWithTranslation(CheckoutApp)
