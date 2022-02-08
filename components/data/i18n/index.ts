import i18n, { use } from "i18next"

import translationCS from "public/static/locales/cs/common.json"
import translationDE from "public/static/locales/de/common.json"
import translationEN from "public/static/locales/en/common.json"
import translationES from "public/static/locales/es/common.json"
import translationFI from "public/static/locales/fi/common.json"
import translationFR from "public/static/locales/fr/common.json"
import translationIT from "public/static/locales/it/common.json"
import translationNB from "public/static/locales/nb/common.json"
import translationRU from "public/static/locales/ru/common.json"
import translationSV from "public/static/locales/sv/common.json"
import { initReactI18next } from "react-i18next"

const languages = ["en", "cs", "de", "es", "fi", "fr", "it", "nb", "ru", "sv"]

const resources = {
  en: {
    translation: translationEN,
  },
  cs: {
    translation: translationCS,
  },
  de: {
    translation: translationDE,
  },
  es: {
    translation: translationES,
  },
  fi: {
    translation: translationFI,
  },
  fr: {
    translation: translationFR,
  },
  it: {
    translation: translationIT,
  },
  nb: {
    translation: translationNB,
  },
  ru: {
    translation: translationRU,
  },
  sv: {
    translation: translationSV,
  },
}

use(initReactI18next).init({
  resources,
  lng: languages[0],
  fallbackLng: languages,
})

export default i18n
