import i18n, { use } from "i18next"
import translationDE from "public/static/locales/de/common.json"
import translationEN from "public/static/locales/en/common.json"
import translationES from "public/static/locales/es/common.json"
import translationFR from "public/static/locales/fr/common.json"
import translationIT from "public/static/locales/it/common.json"
import translationPL from "public/static/locales/pl/common.json"
import { initReactI18next } from "react-i18next"

const languages = ["en", "it", "de", "pl", "es", "fr"]

const resources = {
  en: {
    translation: translationEN,
  },
  it: {
    translation: translationIT,
  },
  de: {
    translation: translationDE,
  },
  pl: {
    translation: translationPL,
  },
  es: {
    translation: translationES,
  },
  fr: {
    translation: translationFR,
  },
}

use(initReactI18next).init({
  resources,
  lng: languages[0],
  fallbackLng: languages,
})

export default i18n
