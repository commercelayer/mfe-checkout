import type { AppProps } from "next/app"
import "../styles/globals.css"
// eslint-disable-next-line import/order
import { appWithTranslation } from "next-i18next"

import "components/data/i18n"
import { useEffect, useState } from "react"

function CheckoutApp(props: AppProps) {
  const { Component, pageProps } = props
  const [browser, setBrowser] = useState(false)
  useEffect(() => {
    if (typeof window !== "undefined") setBrowser(true)
  }, [])

  return browser ? <Component {...pageProps} /> : null
}

export default appWithTranslation(CheckoutApp)
