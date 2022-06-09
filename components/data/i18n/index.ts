import i18n, { use } from "i18next"
import translationDE from "public/static/locales/de/common.json"
import translationEN from "public/static/locales/en/common.json"
import translationIT from "public/static/locales/it/common.json"
import { initReactI18next } from "react-i18next"

const languages = ["en", "it", "de"]

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
}

use(initReactI18next).init({
  resources,
  lng: languages[0],
  fallbackLng: languages,
})

export default i18n
