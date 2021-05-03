import "../styles/globals.css"
import { appWithTranslation } from "next-i18next"
import type { AppProps } from "next/app"
import "components/data/i18n"

if (
  process.env.NEXT_PUBLIC_API_MOCKING === "enabled" &&
  process.env.CYPRESS_RECORD === "false"
) {
  require("../mocks")
}

function CheckoutApp(props: AppProps) {
  const { Component, pageProps } = props

  return <Component {...pageProps} />
}

export default appWithTranslation(CheckoutApp)
