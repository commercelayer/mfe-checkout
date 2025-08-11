import type { AppProps } from "next/app"
import "../styles/globals.css"
import "../styles/CheckIcon.css"
import "../styles/footer.css"
import "../styles/payment.css"
import "../styles/shipping.css"
import "../styles/place-order.css"
import "../styles/step-container.css"
import "../styles/address-input.css"
import "../styles/accordion.css"
import "../styles/theme.css"

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
