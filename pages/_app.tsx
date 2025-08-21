import type { AppProps } from "next/app"
import "../styles/theme.css"
import "../styles/globals.css"
import "../styles/check-icon.css"
import "../styles/footer.css"
import "../styles/payment.css"
import "../styles/shipping.css"
import "../styles/place-order.css"
import "../styles/step-container.css"
import "../styles/address-input.css"
import "../styles/accordion.css"

import { appWithTranslation } from "next-i18next"

import "components/data/i18n"
import { loadNewRelicAgent } from "components/data/NewRelic"
import { useEffect, useState } from "react"

function CheckoutApp(props: AppProps) {
  const { Component, pageProps } = props
  const [browser, setBrowser] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBrowser(true)
      loadNewRelicAgent()
    }
  }, [])

  return browser ? <Component {...pageProps} /> : null
}

export default appWithTranslation(CheckoutApp)
