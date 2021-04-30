import "../styles/globals.css"

import i18n from "i18next"
import { appWithTranslation } from "next-i18next"
import type { AppProps } from "next/app"
import translationEN from "public/static/locales/en/common.json"
import translationIT from "public/static/locales/it/common.json"
import { initReactI18next } from "react-i18next"

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

  return <Component {...pageProps} />
}

export default appWithTranslation(CheckoutApp)
